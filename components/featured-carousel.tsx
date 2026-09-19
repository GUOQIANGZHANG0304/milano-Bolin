"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DishCard } from "@/components/dish-card";
import type { DishRecord } from "@/lib/dishes";

const pageSize = 6;

export function FeaturedCarousel({ dishes }: { dishes: DishRecord[] }) {
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(dishes.length / pageSize);
  const visible = dishes.slice(page * pageSize, page * pageSize + pageSize);

  if (!dishes.length) return <div className="status-card">今日招牌正在更新，请稍后再来看看。</div>;

  return <div className="featured-carousel">
    <div className="dish-grid featured-grid">{visible.map((dish, index) => <DishCard key={dish.id} dish={dish} index={index} />)}</div>
    {pageCount > 1 && <div className="carousel-controls" aria-label="今日招牌翻页">
      <button type="button" aria-label="上一页" disabled={page === 0} onClick={() => setPage(value => Math.max(0, value - 1))}><ChevronLeft /></button>
      <span>第 {page + 1} / {pageCount} 页</span>
      <button type="button" aria-label="下一页" disabled={page === pageCount - 1} onClick={() => setPage(value => Math.min(pageCount - 1, value + 1))}><ChevronRight /></button>
    </div>}
  </div>;
}
