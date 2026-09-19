import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { dishes } from "@/db/schema";
import { isAdminRequest } from "@/lib/admin-auth";

type TranslationRow = { id: string; nameIt: string; descriptionIt: string };

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "请先登录管理员后台。" }, { status: 401 });
  try {
    const body = await request.json() as { translations?: TranslationRow[] };
    const rows = Array.isArray(body.translations) ? body.translations.slice(0, 300) : [];
    const db = getDb();
    let updated = 0;
    for (const row of rows) {
      const id = Number(row.id);
      const nameIt = String(row.nameIt ?? "").trim();
      const descriptionIt = String(row.descriptionIt ?? "").trim();
      if (!Number.isInteger(id) || id <= 0 || !nameIt || !descriptionIt) continue;
      await db.update(dishes).set({ nameIt, descriptionIt }).where(eq(dishes.id, id));
      updated += 1;
    }
    return Response.json({ updated });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "意大利语翻译同步失败。" }, { status: 500 });
  }
}
