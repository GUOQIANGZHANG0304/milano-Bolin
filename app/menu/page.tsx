import { SiteHeader } from "@/components/site-header"; import { MenuClient } from "./menu-client";
export default function MenuPage(){return <main><SiteHeader/><section className="page-hero"><span className="eyebrow light">米兰博林菜单</span><h1>四时风物，<br/>皆可入席。</h1><p>菜品价格以欧元计，部分时令菜品随当日食材调整。</p></section><section className="section menu-section"><MenuClient/></section></main>}
