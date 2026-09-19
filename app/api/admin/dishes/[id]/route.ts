import { eq } from "drizzle-orm";
import { env } from "cloudflare:workers";
import { getDb } from "@/db";
import { dishes } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";
import { normalizeDbDish } from "@/lib/dishes";

function parseId(value: string) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function uploadedImageKey(url: string) {
  const match = url.match(/^\/api\/images\/([a-f0-9-]+\.(?:jpg|png|webp))$/);
  return match?.[1] ?? null;
}

async function removeUploadedImage(url: string) {
  const key = uploadedImageKey(url);
  if (key && env.BUCKET) await env.BUCKET.delete(key);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "请先登录管理员后台。" }, { status: 401 });
  }
  const id = parseId((await params).id);
  if (!id) return Response.json({ error: "菜品编号无效。" }, { status: 400 });

  try {
    const body = await request.json() as Record<string, unknown>;
    const name = String(body.name ?? "").trim();
    const category = String(body.category ?? "").trim();
    const image = String(body.image ?? "").trim();
    const description = String(body.description ?? "").trim();
    const price = Number(body.price);
    const isPublished = body.isPublished === true;
    const isFeatured = body.featured === true;
    if (!name || !category || !image || !description || !Number.isFinite(price) || price <= 0) {
      return Response.json({ error: "请完整填写菜品信息，价格需大于 0。" }, { status: 400 });
    }
    const db = getDb();
    const [previous] = await db.select({ image: dishes.image }).from(dishes).where(eq(dishes.id, id)).limit(1);
    const [dish] = await db.update(dishes).set({ name, category, image, description, price, isPublished, isFeatured }).where(eq(dishes.id, id)).returning();
    if (!dish) return Response.json({ error: "没有找到该菜品。" }, { status: 404 });
    if (previous?.image && previous.image !== image) await removeUploadedImage(previous.image);
    return Response.json({ dish: normalizeDbDish(dish) });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "菜品修改失败，请稍后重试。" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "请先登录管理员后台。" }, { status: 401 });
  }
  const id = parseId((await params).id);
  if (!id) return Response.json({ error: "菜品编号无效。" }, { status: 400 });

  try {
    const [dish] = await getDb().delete(dishes).where(eq(dishes.id, id)).returning({ id: dishes.id, image: dishes.image });
    if (!dish) return Response.json({ error: "没有找到该菜品。" }, { status: 404 });
    await removeUploadedImage(dish.image);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "菜品删除失败，请稍后重试。" }, { status: 500 });
  }
}
