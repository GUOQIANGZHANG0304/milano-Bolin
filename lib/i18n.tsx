"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { DishRecord } from "@/lib/dishes";

export type Language = "zh" | "it";

const categoryIt: Record<string, string> = { "早点":"Colazione", "冷盘":"Piatti freddi", "炒菜":"Piatti saltati", "面条":"Pasta e noodles", "全部":"Tutti" };
const tagIt: Record<string, string> = { "早餐":"Colazione", "主食":"Primi piatti", "鸡肉":"Pollo", "鸭肉":"Anatra", "牛肉":"Manzo", "猪肉":"Maiale", "鱼肉":"Pesce", "虾类":"Gamberi", "海鲜":"Frutti di mare", "蔬菜":"Verdure", "豆制品":"Tofu e soia" };

const dishIt: Record<string, string> = {
  "博林红烧肉":"Pancetta di maiale brasata Bolin", "清蒸鲈鱼":"Branzino al vapore", "石锅麻婆豆腐":"Mapo tofu in pentola di pietra", "蒜香时蔬":"Verdure di stagione all'aglio", "金沙大虾":"Gamberoni croccanti al tuorlo d'uovo", "樟茶鸭":"Anatra affumicata al tè",
  "鱼饼":"Polpette di pesce", "盐水虾":"Gamberi in salamoia", "鸭掌":"Zampe d'anatra", "鸭舌":"Lingue d'anatra", "卤牛肉":"Manzo brasato alle spezie", "卤大肠":"Intestino di maiale brasato", "麻油鸭（半只）":"Mezza anatra all'olio di sesamo", "熏鸡（一只）":"Pollo intero affumicato", "熏鸭（半只）":"Mezza anatra affumicata", "卤肚":"Trippa brasata", "炸排骨":"Costine di maiale fritte", "Bolino拌香菜":"Insalata Bolino al coriandolo", "拌海带":"Insalata di alghe", "白斩鸡":"Pollo bianco alla cantonese", "葱油鸡":"Pollo all'olio di cipollotto",
  "炸响铃":"Rotolini croccanti di tofu", "炸咸带鱼":"Pesce sciabola salato fritto", "卤蹄筋":"Tendine brasato", "卤目鱼":"Seppia brasata", "炸三层肉":"Pancetta croccante", "咸肉":"Maiale salato", "拌鸡爪":"Insalata di zampe di pollo", "金针菇拌牛肚":"Trippa con funghi enoki", "金针菇拌海蜇皮":"Medusa con funghi enoki", "咸雪蛤":"Rana salata", "咸螺蛳":"Lumachine d'acqua salate", "皮蛋":"Uovo centenario", "皮蛋豆腐":"Tofu con uovo centenario", "盘菜生":"Rapa cinese marinata", "白萝卜生":"Daikon marinato",
  "香菇肉":"Maiale con funghi shiitake", "香菇鸭":"Anatra con funghi shiitake", "葱油笋":"Germogli di bambù al cipollotto", "红烧鱿鱼":"Calamari brasati in salsa di soia", "青豆虾仁":"Gamberetti con piselli", "豆腐虾仁":"Tofu con gamberetti", "蛋炒虾仁":"Gamberetti saltati con uova", "蒸目鱼蛋":"Uova di seppia al vapore", "蒸咸红鱼":"Pesce rosso salato al vapore", "蒸咸杂鱼":"Pesce misto salato al vapore", "酸菜跳鱼":"Pesce con verdure fermentate", "豆腐跳鱼":"Pesce con tofu", "咸蹄扣肉":"Maiale al vapore con zampone salato", "蹄膀扣肉":"Stinco di maiale brasato", "红烧狮子头":"Polpette di maiale brasate", "梅菜肉丸":"Polpette di maiale con verdure conservate", "咸蛋蒸肉":"Maiale al vapore con uovo salato",
  "干张卷":"Rotolini di sfoglia di tofu", "泡豆腐挟肉":"Tofu ripieno di carne", "芹菜炒鱼饼":"Polpette di pesce saltate con sedano", "芹菜炒香肠":"Salsiccia saltata con sedano", "芹菜炒咸肉":"Maiale salato con sedano", "炒螺蛳":"Lumachine d'acqua saltate", "炒田螺":"Lumache saltate", "咸菜目鱼":"Seppia con verdure conservate", "韭菜目鱼":"Seppia con erba cipollina cinese", "芹菜目鱼":"Seppia con sedano", "青椒目鱼":"Seppia con peperone verde", "青豆炒鲜鱿鱼":"Calamari freschi con piselli", "咸菜炒鲜鱿鱼":"Calamari freschi con verdure conservate", "炸小虾":"Gamberetti fritti", "咸菜小虾":"Gamberetti con verdure conservate", "红烧小虾":"Gamberetti brasati",
  "炒牛肉":"Manzo saltato", "青椒牛肉":"Manzo con peperone verde", "香葱牛肉":"Manzo con cipollotto", "芹菜牛肉":"Manzo con sedano", "双冬牛肉":"Manzo con funghi e bambù", "蒜苗牛肉":"Manzo con germogli d'aglio", "萝卜条肉片":"Maiale a fette con daikon", "鱼香肉丝":"Maiale sfilacciato alla Sichuan", "咸菜肉丝":"Maiale sfilacciato con verdure conservate", "梅菜扣肉":"Pancetta al vapore con verdure conservate", "笋干扣肉":"Pancetta al vapore con bambù essiccato", "大葱扣肉":"Pancetta al vapore con porro", "青椒肉片":"Maiale a fette con peperone verde",
  "大葱炒大肠":"Intestino di maiale saltato con porro", "炒大肠":"Intestino di maiale saltato", "咸菜大肠":"Intestino di maiale con verdure conservate", "韭菜大肠":"Intestino di maiale con erba cipollina cinese", "酸菜肉片":"Maiale a fette con cavolo fermentato", "红烧排骨":"Costine di maiale brasate", "豆腐干排骨":"Costine con tofu essiccato", "糖醋排骨":"Costine in agrodolce", "椒盐排骨":"Costine sale e pepe", "炒鸡":"Pollo saltato", "土豆牛肉":"Manzo con patate", "木菇排骨":"Costine con funghi", "梅菜干鸡爪":"Zampe di pollo con verdure conservate",
  "排骨汤面":"Noodles in brodo con costine", "咸菜肉丝面":"Noodles con maiale e verdure conservate", "青菜肉丝面":"Noodles con maiale e verdure verdi", "海鲜面":"Noodles ai frutti di mare", "三鲜面":"Noodles alle tre delizie", "排骨粉面":"Vermicelli di riso con costine", "猪脏粉面":"Vermicelli di riso con frattaglie di maiale", "海鲜年糕":"Gnocchi di riso ai frutti di mare", "青菜年糕":"Gnocchi di riso con verdure verdi",
  "紫菜汤":"Zuppa di alghe nori", "豆浆":"Latte di soia", "生煎包":"Bao alla piastra", "茶叶蛋":"Uovo al tè", "实心包":"Bao al vapore tradizionale", "油条":"Frittella cinese youtiao", "豆腐脑":"Tofu morbido", "麻球":"Pallina di sesamo", "糯玉米":"Mais glutinoso", "粽子":"Zongzi di riso glutinoso", "清明团":"Dolcetto verde di riso Qingming", "咸菜包":"Bao con verdure conservate", "鲜肉包":"Bao con carne di maiale", "叉烧包":"Bao con maiale char siu", "松糕":"Torta di riso al vapore", "糯米饭":"Riso glutinoso", "青菜炒粉干":"Vermicelli di riso saltati con verdure"
};

const specificDescriptionIt: Record<string, string> = {
  "博林红烧肉":"Pancetta selezionata, brasata lentamente fino a diventare tenera, con un gusto ricco e delicatamente agrodolce.",
  "清蒸鲈鱼":"Branzino fresco cotto al vapore con zenzero, cipollotto e salsa di soia, per conservarne tutta la delicatezza.",
  "石锅麻婆豆腐":"Tofu morbido con pasta di fave piccante del Sichuan, servito caldo in pentola di pietra.",
  "蒜香时蔬":"Verdure fresche di stagione saltate a fuoco vivo con aglio.",
  "金沙大虾":"Gamberoni croccanti avvolti in una salsa cremosa al tuorlo d'uovo salato.",
  "樟茶鸭":"Anatra profumata al tè, dalla pelle croccante, servita con sale e pepe artigianale."
};

export function translateCategory(value: string, language: Language) { return language === "it" ? categoryIt[value] ?? value : value; }
export function translateTag(value: string, language: Language) { return language === "it" ? tagIt[value] ?? value : value; }
export function translateDish(dish: DishRecord, language: Language): DishRecord {
  if (language === "zh") return dish;
  const name = dishIt[dish.name] ?? dish.name;
  const generic = dish.description.includes("博林打包点心店现做菜品") || dish.description === `${dish.name}，博林打包点心店现做菜品。`;
  return { ...dish, name, category: translateCategory(dish.category, language), tags: dish.tags.map(tag => translateTag(tag, language)), description: specificDescriptionIt[dish.name] ?? (generic ? `${name}, preparato al momento nella cucina di Bolin.` : dish.description) };
}

const LanguageContext = createContext<{ language: Language; setLanguage: (value: Language) => void }>({ language: "zh", setLanguage: () => undefined });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("zh");
  useEffect(() => { const saved = window.localStorage.getItem("bolin-language"); if (saved === "zh" || saved === "it") setLanguageState(saved); }, []);
  const setLanguage = (value: Language) => { setLanguageState(value); window.localStorage.setItem("bolin-language", value); document.documentElement.lang = value === "it" ? "it" : "zh-CN"; };
  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
