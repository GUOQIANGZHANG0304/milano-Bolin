import { adminSessionCookie, createAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: unknown };
    const password = typeof body.password === "string" ? body.password : "";
    if (!(await verifyAdminPassword(password))) {
      return Response.json({ error: "管理员密码不正确。" }, { status: 401 });
    }

    const response = Response.json({ ok: true });
    response.headers.set("Set-Cookie", adminSessionCookie(await createAdminSession()));
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return Response.json({ error: "管理员登录尚未配置，请检查 Cloudflare Secret。" }, { status: 503 });
  }
}
