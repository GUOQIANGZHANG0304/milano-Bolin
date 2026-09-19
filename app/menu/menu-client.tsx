"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { DishCard } from "@/components/dish-card";
import { DISH_TAGS, type DishRecord } from "@/lib/dishes";

const categories = ["全部", "早点", "冷盘", "炒菜", "面条"];

export function MenuClient() {
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

  const matchesQuery = (dish: DishRecord) =>
    `${dish.name}${dish.description}${dish.tags.join("")}`.includes(query);
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
      <Search size={18}/><input aria-label="搜索菜品" placeholder="搜索菜品" value={query} onChange={event => setQuery(event.target.value)}/>
    </div>

    <div className="desktop-menu-content">
      <div className="menu-tools">
        <label className="search-box"><Search size={18}/><input aria-label="搜索菜品" placeholder="搜索菜品、描述或标签" value={query} onChange={event => setQuery(event.target.value)}/></label>
        <div className="category-pills">{categories.map(item => <button key={item} className={item === category ? "selected" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </div>
      <div className="menu-tag-filter" aria-label="按二级标签筛选">{DISH_TAGS.map(tag => <label key={tag}><input type="checkbox" checked={tags.includes(tag)} onChange={() => setTags(current => current.includes(tag) ? current.filter(value => value !== tag) : [...current, tag])}/><span>{tag}</span></label>)}</div>
      {loading ? <div className="status-card">正在准备菜单…</div> : filtered.length ? <div className="dish-grid menu-grid">{filtered.map((dish, index) => <DishCard key={dish.id} dish={dish} index={index}/>)}</div> : <div className="status-card">没有找到符合条件的菜品。</div>}
    </div>

    <div className="mobile-menu-browser">
      <aside aria-label="二级标签">{["全部", ...DISH_TAGS].map(tag => <button type="button" key={tag} className={mobileTag === tag ? "active" : ""} onClick={() => setMobileTag(tag)}>{tag}</button>)}</aside>
      <section aria-live="polite">{loading ? <p className="mobile-menu-empty">正在准备菜单…</p> : mobileDishes.length ? mobileDishes.map(dish => <a href={`/menu/${dish.id}`} className="mobile-dish-row" key={dish.id}><img src={dish.image} alt={dish.name}/><div><b>{dish.name}</b><small>{dish.category}{dish.tags.length ? ` · ${dish.tags.join(" · ")}` : ""}</small><strong>€{dish.price.toFixed(2)}</strong></div></a>) : <p className="mobile-menu-empty">该标签暂无菜品</p>}</section>
    </div>
  </>;
}
