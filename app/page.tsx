import Link from "next/link";
import { ArrowRight, Clock3, MapPin, Phone, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DishCard } from "@/components/dish-card";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { dishes } from "@/db/schema";
import { normalizeDbDish, sampleDishes } from "@/lib/dishes";

export default async function Home(){let featured=sampleDishes.slice(0,3);try{const rows=await getDb().select().from(dishes).where(eq(dishes.isPublished,true)).orderBy(desc(dishes.id)).limit(3);if(rows.length)featured=rows.map(normalizeDbDish)}catch{}return <main><SiteHeader/>
<section className="hero" id="about"><img className="hero-bg" src="/hero-feast.png" alt="米兰博林外卖打包点心店招牌菜"/><div className="hero-shade"/><div className="hero-content"><span className="eyebrow light">米兰点心 · 现做外带</span><h1>一席好味，<br/>打包带走。</h1><p>米兰博林外卖打包点心店，为附近街坊准备现做中式点心与家常菜。提前选好，轻松到店取餐。</p><div className="hero-actions"><Link href="/menu" className="button primary">浏览完整菜单 <ArrowRight size={18}/></Link><a href="#contact" className="button ghost">查看门店信息</a></div></div><div className="hero-note"><Sparkles size={18}/><span><b>今日推荐</b>每日菜品，随到店食材更新</span></div></section>
<section className="about-band"><div><span>01</span><p>坚持每日鲜采，拒绝预制口感</p></div><div><span>02</span><p>传统技法与现代呈现相得益彰</p></div><div><span>03</span><p>适合好友小聚与家庭宴请</p></div></section>
<section className="section" id="featured"><div className="section-heading"><div><span className="eyebrow">本店甄选</span><h2>今日招牌</h2></div><Link href="/menu" className="text-link">查看全部菜品 <ArrowRight size={17}/></Link></div>{featured.length?<div className="dish-grid">{featured.map((dish,index)=><DishCard key={dish.id} dish={dish} index={index}/>)}</div>:<div className="status-card">今日菜品正在更新，请稍后再来看看。</div>}</section>
<section className="story-section"><div className="story-number">博</div><div><span className="eyebrow light">关于米兰博林</span><h2>好味道，来自不慌不忙的功夫。</h2></div><p>从和面、调馅到蒸制，每一份点心都遵循它自己的节奏。我们以熟悉的中国味道，为在米兰的每一顿日常增添温暖。</p></section>
<section className="contact-section" id="contact"><div className="contact-intro"><span className="eyebrow">门店信息</span><h2>选好点心，<br/>轻松到店取餐。</h2><p>如需提前预订或咨询当日菜品，请在营业时间内致电门店。</p></div><div className="contact-cards"><div><MapPin/><span><small>地址</small>Via Giordano Bruno, 15, 20154 Milano MI</span></div><div><Phone/><span><small>电话</small><a href="tel:+390233103424">02 3310 3424</a></span></div><div><Clock3/><span><small>营业时间</small><span className="hours-list"><b>周五：休息</b><b>周六至周四：08:00–21:00</b></span></span></div></div></section>
<footer><div className="brand footer-brand"><span className="brand-mark">博</span><span><b>米兰博林</b><small>外卖打包点心店</small></span></div><p>现做点心，暖心外带。</p><span>© 2026 米兰博林外卖打包点心店</span></footer></main>}
