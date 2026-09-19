"use client";
import { SiteHeader } from "@/components/site-header";
import { MenuClient } from "@/app/menu/menu-client";
import { useLanguage } from "@/lib/i18n";
export function MenuPageContent(){const{language}=useLanguage();const it=language==="it";return <main><SiteHeader/><section className="page-hero"><span className="eyebrow light">{it?"Menu Bolin Milano":"米兰博林菜单"}</span><h1>{it?<>Sapori per ogni<br/>momento della giornata.</>:<>四时风物，<br/>皆可入席。</>}</h1><p>{it?"Prezzi in euro. Alcuni piatti stagionali possono variare secondo la disponibilità degli ingredienti.":"菜品价格以欧元计，部分时令菜品随当日食材调整。"}</p></section><section className="section menu-section"><MenuClient/></section></main>}
