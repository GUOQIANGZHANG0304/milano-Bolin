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
    let importedCount = 0;
    for (let offset = 0; offset < missingSamples.length; offset += 10) {
      const batch = missingSamples.slice(offset, offset + 10);
      const imported = await db.insert(dishes).values(batch.map(({ name, category, price, image, description, tags, isPublished, featured }) => ({
        name, category, price, image, description, tags, isPublished, isFeatured: featured === true,
      }))).returning({ id: dishes.id });
      importedCount += imported.length;
    }
    let updatedCount = 0;
    for (const dish of menuSeedDishes) {
      const id = existingByName.get(dish.name);
      if (id === undefined) continue;
      await db.update(dishes).set({ tags: dish.tags, image: dish.image }).where(eq(dishes.id, id));
      updatedCount += 1;
    }
    return Response.json({ count: importedCount, updatedCount }, { status: importedCount ? 201 : 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "菜单导入失败，请稍后重试或查看 Worker 日志。" }, { status: 500 });
  }
}
