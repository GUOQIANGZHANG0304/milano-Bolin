import { getDb } from "@/db";
import { dishes } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { menuSeedDishes } from "@/lib/menu-seed";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "请先登录管理员后台。" }, { status: 401 });
  }
  try {
    const db = getDb();
    const existing = await db.select({ id: dishes.id, name: dishes.name }).from(dishes);
    const existingByName = new Map(existing.map((dish) => [dish.name, dish.id]));
    const existingNames = new Set(existingByName.keys());
    const missingSamples = menuSeedDishes.filter((dish) => !existingNames.has(dish.name));
    const imported = missingSamples.length ? await db.insert(dishes).values(missingSamples.map(({ name, category, price, image, description, tags, isPublished, featured }) => ({
      name, category, price, image, description, tags, isPublished, isFeatured: featured === true,
    }))).returning({ id: dishes.id }) : [];
    let updatedCount = 0;
    for (const dish of menuSeedDishes) {
      const id = existingByName.get(dish.name);
      if (id === undefined) continue;
      await db.update(dishes).set({ tags: dish.tags }).where(eq(dishes.id, id));
      updatedCount += 1;
    }
    return Response.json({ count: imported.length, updatedCount }, { status: imported.length ? 201 : 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "案例导入失败，请确认 D1 迁移已经完成。" }, { status: 500 });
  }
}
