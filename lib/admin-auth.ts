import { env } from "cloudflare:workers";

const COOKIE_NAME = "bolin_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function getAdminPassword() {
  const password = env.ADMIN_PASSWORD?.trim();
  if (!password) throw new Error("ADMIN_PASSWORD secret is not configured.");
  return password;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAdminPassword()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toBase64Url(new Uint8Array(signature));
}

export async function verifyAdminPassword(candidate: string) {
  const expected = new TextEncoder().encode(getAdminPassword());
  const actual = new TextEncoder().encode(candidate);
  const maxLength = Math.max(expected.length, actual.length);
  let difference = expected.length ^ actual.length;
  for (let index = 0; index < maxLength; index += 1) {
    difference |= (expected[index] ?? 0) ^ (actual[index] ?? 0);
  }
  return difference === 0;
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ expiresAt })));
  return `${payload}.${await sign(payload)}`;
}

export async function verifyAdminSession(token?: string | null) {
  if (!token) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expected = await sign(payload);
  if (signature.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < signature.length; index += 1) {
    difference |= signature.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  if (difference !== 0) return false;

  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { expiresAt?: number };
    return typeof data.expiresAt === "number" && data.expiresAt > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function getAdminSessionFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const value = cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);
  return value ? decodeURIComponent(value) : null;
}

export async function isAdminRequest(request: Request) {
  try {
    return await verifyAdminSession(getAdminSessionFromRequest(request));
  } catch {
    return false;
  }
}

export function adminSessionCookie(token: string) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DURATION_SECONDS}`;
}

export function clearAdminSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export { COOKIE_NAME };
