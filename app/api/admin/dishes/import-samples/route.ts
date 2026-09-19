import { getDb } from "@/db";
import { dishes } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { sampleDishes } from "@/lib/dishes";

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "请先登录管理员后台。" }, { status: 401 });
  }
  try {
    const db = getDb();
    const existing = await db.select({ name: dishes.name }).from(dishes);
    const existingNames = new Set(existing.map((dish) => dish.name));
    const missingSamples = sampleDishes.filter((dish) => !existingNames.has(dish.name));
    if (!missingSamples.length) return Response.json({ count: 0 });
    const imported = await db.insert(dishes).values(missingSamples.map(({ name, category, price, image, description, tags, isPublished, featured }) => ({
      name, category, price, image, description, tags, isPublished, isFeatured: featured === true,
    }))).returning({ id: dishes.id });
    return Response.json({ count: imported.length }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "案例导入失败，请确认 D1 迁移已经完成。" }, { status: 500 });
  }
}
