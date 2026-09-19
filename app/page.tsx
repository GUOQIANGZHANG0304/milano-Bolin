import { HomeContent } from "@/components/home-content";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { dishes } from "@/db/schema";
import { normalizeDbDish, sampleDishes } from "@/lib/dishes";

export default async function Home(){let featured=sampleDishes.filter(dish=>dish.featured);try{const rows=await getDb().select().from(dishes).where(and(eq(dishes.isPublished,true),eq(dishes.isFeatured,true))).orderBy(desc(dishes.id));featured=rows.map(normalizeDbDish)}catch{}return <HomeContent featured={featured}/>}
