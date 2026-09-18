import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { dishes } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { normalizeDbDish } from "@/lib/dishes";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "请先登录管理员后台。" }, { status: 401 });
  }
  try {
    const rows = await getDb().select().from(dishes).orderBy(desc(dishes.id));
    return Response.json({ dishes: rows.map(normalizeDbDish) });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "菜品列表加载失败，请检查数据库迁移。" }, { status: 500 });
  }
}
