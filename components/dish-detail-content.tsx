"use client";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import type { DishRecord } from "@/lib/dishes";
import { translateDish, useLanguage } from "@/lib/i18n";
export function DishDetailContent({dish}:{dish:DishRecord}){const{language}=useLanguage();const shown=translateDish(dish,language);const it=language==="it";return <main><SiteHeader/><section className="detail-page"><a href="/menu" className="back-link"><ArrowLeft size={17}/>{it?"Torna al menu completo":"返回完整菜单"}</a><div className="detail-grid"><div className="detail-image"><img src={dish.image} alt={shown.name}/></div><div className="detail-copy"><span className="eyebrow">{shown.category}</span><h1>{shown.name}</h1><div className="detail-price">€{dish.price.toFixed(2)}</div>{shown.tags.length>0&&<div className="dish-tags detail-tags">{shown.tags.map(tag=><span key={tag}>{tag}</span>)}</div>}<p>{shown.description}</p><a href="tel:+390233103424" className="button primary">{it?"Prenota per telefono":"电话预订"}</a></div></div></section></main>}
