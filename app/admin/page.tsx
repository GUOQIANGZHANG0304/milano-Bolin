import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminClient } from "./admin-client";
import { COOKIE_NAME, verifyAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  let authenticated = false;
  try {
    authenticated = await verifyAdminSession(token);
  } catch {
    authenticated = false;
  }
  if (!authenticated) redirect("/admin/login");
  return <AdminClient />;
}
