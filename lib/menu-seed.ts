import type { DishRecord } from "@/lib/dishes";

type MenuRow = [name: string, price: number, published?: boolean];

const imageFiles = {
  "冷盘": "Appetizers china.jpg",
  "炒菜": "Cantonese meat dishes.jpg",
  "面条": "Chinese Food - Fried Noodles.JPG",
  "早点": "A Northern Chinese Dim Sum and Noodle dishes at Peking Garden.jpg",
  "海鲜": "A chinese seafood meal.jpg",
};

const imageUrl = (file: string) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;

const rows: Record<string, MenuRow[]> = {
  "冷盘": [
    ["鱼饼",5],["盐水虾",6],["鸭掌",4.5],["鸭舌",7.5],["卤牛肉",6.5],["卤大肠",6],["麻油鸭（半只）",12],["熏鸡（一只）",15],["熏鸭（半只）",8],["卤肚",4.5],["炸排骨",5],["Bolino拌香菜",9],["拌海带",4],["白斩鸡",5],["葱油鸡",6],
    ["炸响铃",4.5],["炸咸带鱼",7],["卤蹄筋",6],["卤目鱼",9],["炸三层肉",4.5],["咸肉",5],["拌鸡爪",5.5],["金针菇拌牛肚",5],["金针菇拌海蜇皮",9],["咸雪蛤",0,false],["咸螺蛳",0,false],["皮蛋",7],["皮蛋豆腐",4.5],["盘菜生",4],["白萝卜生",3.5],
  ],
  "炒菜": [
    ["香菇肉",6.5],["香菇鸭",7],["葱油笋",4.5],["红烧鱿鱼",7],["青豆虾仁",6],["豆腐虾仁",6],["蛋炒虾仁",6],["蒸目鱼蛋",7.5],["蒸咸红鱼",0,false],["蒸咸杂鱼",7],["酸菜跳鱼",0,false],["豆腐跳鱼",0,false],["咸蹄扣肉",7.5],["蹄膀扣肉",7.5],["红烧狮子头",5],["梅菜肉丸",5.5],["咸蛋蒸肉",6],
    ["干张卷",5.5],["泡豆腐挟肉",5.5],["芹菜炒鱼饼",5],["芹菜炒香肠",0,false],["芹菜炒咸肉",0,false],["炒螺蛳",0,false],["炒田螺",0,false],["咸菜目鱼",7],["韭菜目鱼",7],["芹菜目鱼",7],["青椒目鱼",7],["青豆炒鲜鱿鱼",7],["咸菜炒鲜鱿鱼",7],["炸小虾",6],["咸菜小虾",6],["红烧小虾",6],
    ["炒牛肉",6.5],["青椒牛肉",6.5],["香葱牛肉",6.5],["芹菜牛肉",6.5],["双冬牛肉",6.5],["蒜苗牛肉",7],["萝卜条肉片",6],["鱼香肉丝",6],["咸菜肉丝",6],["梅菜扣肉",6.5],["笋干扣肉",6.5],["大葱扣肉",6],["青椒肉片",6],
    ["大葱炒大肠",6.5],["炒大肠",6.5],["咸菜大肠",6.5],["韭菜大肠",6.5],["酸菜肉片",6],["红烧排骨",6.5],["豆腐干排骨",6.5],["糖醋排骨",6],["椒盐排骨",7],["炒鸡",6],["土豆牛肉",6.5],["木菇排骨",6],["梅菜干鸡爪",5],
  ],
  "面条": [
    ["排骨汤面",5.5],["咸菜肉丝面",4.5],["青菜肉丝面",4.5],["海鲜面",5.5],["三鲜面",7],["排骨粉面",5.5],["猪脏粉面",5.5],["海鲜年糕",5.5],["青菜年糕",4.5],
  ],
  "早点": [
    ["紫菜汤",0.7],["豆浆",0.7],["生煎包",0.7],["茶叶蛋",0.7],["实心包",0.8],["油条",1],["豆腐脑",1],["麻球",1.5],["糯玉米",1.5],["粽子",1.5],["清明团",1.5],["咸菜包",1.5],["鲜肉包",1.5],["叉烧包",1.5],["松糕",1.5],["糯米饭",2.8],["青菜炒粉干",3],
  ],
};

function tagsFor(name: string, category: string) {
  const tags: string[] = [];
  const add = (tag: string) => { if (!tags.includes(tag)) tags.push(tag); };
  if (category === "早点") add("早餐");
  if (category === "面条" || /包|油条|麻球|玉米|粽子|清明团|松糕|糯米饭|粉干|年糕/.test(name)) add("主食");
  if (/鸡/.test(name)) add("鸡肉");
  if (/鸭/.test(name)) add("鸭肉");
  if (/牛|牛肚|牛肉/.test(name)) add("牛肉");
  if (!/牛肉|牛肚/.test(name) && /猪|排骨|大肠|蹄|卤肚|三层肉|咸肉|肉片|肉丝|扣肉|肉丸|蒸肉|狮子头|香肠|鲜肉|叉烧|香菇肉/.test(name)) add("猪肉");
  if (/鱼/.test(name) && !/目鱼|鱿鱼/.test(name)) add("鱼肉");
  if (/虾/.test(name)) { add("虾类"); add("海鲜"); }
  if (/海鲜|海带|海蜇|鱿鱼|目鱼|螺|雪蛤/.test(name)) add("海鲜");
  if (/紫菜|青菜|咸菜|韭菜|芹菜|香菜|萝卜|笋|梅菜|酸菜|青椒|土豆|木菇|金针菇|香菇|盘菜|蒜苗|大葱|香葱|双冬|玉米/.test(name)) add("蔬菜");
  if (/豆腐|豆浆|豆腐脑|干张|响铃/.test(name)) add("豆制品");
  return tags;
}

export const menuSeedDishes: DishRecord[] = Object.entries(rows).flatMap(([category, items]) => items.map(([name, price, published = true], index) => {
  const tags = tagsFor(name, category);
  const seafood = tags.includes("海鲜") || tags.includes("虾类") || tags.includes("鱼肉");
  return {
    id: `menu-${category}-${index}`,
    name, category, price,
    image: imageUrl(imageFiles[seafood ? "海鲜" : category as keyof typeof imageFiles]),
    description: `${name}，博林打包点心店现做菜品。`,
    tags, isPublished: published, featured: false,
  };
}));
