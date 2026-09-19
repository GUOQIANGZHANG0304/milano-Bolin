"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { DishCard } from "@/components/dish-card";
import { DISH_TAGS, type DishRecord } from "@/lib/dishes";
import { translateCategory, translateDish, translateTag, useLanguage } from "@/lib/i18n";

const categories = ["全部", "早点", "冷盘", "炒菜", "面条"];

export function MenuClient() {
  const { language } = useLanguage();
  const it = language === "it";
  const [dishes, setDishes] = useState<DishRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [tags, setTags] = useState<string[]>([]);
  const [mobileTag, setMobileTag] = useState("全部");

  useEffect(() => {
    fetch("/api/dishes")
      .then(response => response.json())
      .then(data => setDishes(data.dishes ?? []))
      .finally(() => setLoading(false));
  }, []);

  const matchesQuery = (dish: DishRecord) => { const translated=translateDish(dish,"it"); return `${dish.name}${dish.description}${dish.tags.join("")}${translated.name}${translated.description}${translated.tags.join("")}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()); };
  const filtered = dishes.filter(dish =>
    (category === "全部" || dish.category === category) &&
    (tags.length === 0 || tags.some(tag => dish.tags.includes(tag))) &&
    matchesQuery(dish)
  );
  const mobileDishes = dishes.filter(dish =>
    (mobileTag === "全部" || dish.tags.includes(mobileTag)) && matchesQuery(dish)
  );

  return <>
    <div className="menu-search-mobile">
      <Search size={18}/><input aria-label={it?"Cerca piatti":"搜索菜品"} placeholder={it?"Cerca piatti":"搜索菜品"} value={query} onChange={event => setQuery(event.target.value)}/>
    </div>

    <div className="desktop-menu-content">
      <div className="menu-tools">
        <label className="search-box"><Search size={18}/><input aria-label={it?"Cerca piatti":"搜索菜品"} placeholder={it?"Cerca per nome, descrizione o ingrediente":"搜索菜品、描述或标签"} value={query} onChange={event => setQuery(event.target.value)}/></label>
        <div className="category-pills">{categories.map(item => <button key={item} className={item === category ? "selected" : ""} onClick={() => setCategory(item)}>{translateCategory(item,language)}</button>)}</div>
      </div>
      <div className="menu-tag-filter" aria-label={it?"Filtra per ingrediente":"按二级标签筛选"}>{DISH_TAGS.map(tag => <label key={tag}><input type="checkbox" checked={tags.includes(tag)} onChange={() => setTags(current => current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag])}/><span>{translateTag(tag,language)}</span></label>)}</div>
      {loading ? <div className="status-card">{it?"Preparazione del menu…":"正在准备菜单…"}</div> : filtered.length ? <div className="dish-grid menu-grid">{filtered.map((dish, index) => <DishCard key={dish.id} dish={dish} index={index}/>)}</div> : <div className="status-card">{it?"Nessun piatto corrisponde ai filtri selezionati.":"没有找到符合条件的菜品。"}</div>}
    </div>

    <div className="mobile-menu-browser">
      <aside aria-label={it?"Ingredienti":"二级标签"}>{["全部", ...DISH_TAGS].map(tag => <button type="button" key={tag} className={mobileTag === tag ? "active" : ""} onClick={() => setMobileTag(tag)}>{tag==="全部"?translateCategory(tag,language):translateTag(tag,language)}</button>)}</aside>
      <section aria-live="polite">{loading ? <p className="mobile-menu-empty">{it?"Preparazione del menu…":"正在准备菜单…"}</p> : mobileDishes.length ? mobileDishes.map(dish => {const shown=translateDish(dish,language);return <a href={`/menu/${dish.id}`} className="mobile-dish-row" key={dish.id}><img src={dish.image} alt={shown.name}/><div><b>{shown.name}</b><small>{shown.category}{shown.tags.length ? ` · ${shown.tags.join(" · ")}` : ""}</small><strong>€{dish.price.toFixed(2)}</strong></div></a>}) : <p className="mobile-menu-empty">{it?"Nessun piatto in questa categoria":"该标签暂无菜品"}</p>}</section>
    </div>
  </>;
}
