import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const dishes = sqliteTable("dishes", {
  id: integer("id").primaryKey({ autoIncrement: true }), name: text("name").notNull(), category: text("category").notNull(),
  price: integer("price").notNull(), image: text("image").notNull(), description: text("description").notNull(),
  isPublished: integer("is_published", { mode: "boolean" }).notNull().default(true),
  isFeatured: integer("is_featured", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("idx_dishes_category").on(table.category), index("idx_dishes_featured").on(table.isPublished, table.isFeatured)]);
export type Dish = typeof dishes.$inferSelect;
