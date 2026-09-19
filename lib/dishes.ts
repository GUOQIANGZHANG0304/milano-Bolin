export const DISH_TAGS = ["早餐","主食","鸡肉","鸭肉","牛肉","猪肉","鱼肉","虾类","海鲜","蔬菜","豆制品"] as const;
export type DishRecord = { id: string; name: string; category: string; price: number; image: string; description: string; tags: string[]; isPublished: boolean; featured?: boolean };
export const sampleDishes: DishRecord[] = [
  { id:"signature-hongshao",name:"博林红烧肉",category:"炒菜",price:88,tags:["猪肉"],isPublished:true,featured:true,image:"/hero-feast.png",description:"精选层次分明的五花肉，小火慢煨至酥而不散，入口咸甜醇厚。" },
  { id:"signature-fish",name:"清蒸鲈鱼",category:"炒菜",price:128,tags:["鱼肉"],isPublished:true,featured:true,image:"/hero-feast.png",description:"鲜活鲈鱼现点现蒸，佐以葱姜豉油，保留鱼肉最清甜的本味。" },
  { id:"signature-tofu",name:"石锅麻婆豆腐",category:"炒菜",price:58,tags:["豆制品"],isPublished:true,featured:true,image:"/hero-feast.png",description:"嫩豆腐与郫县豆瓣慢烧，麻、辣、鲜、香在滚烫石锅中层层展开。" },
  { id:"seasonal-greens",name:"蒜香时蔬",category:"炒菜",price:38,tags:["蔬菜"],isPublished:true,image:"/hero-feast.png",description:"每日精选当季鲜蔬，大火快炒，清爽脆嫩。" },
  { id:"golden-shrimp",name:"金沙大虾",category:"炒菜",price:108,tags:["虾类","海鲜"],isPublished:true,image:"/hero-feast.png",description:"大虾外酥里嫩，裹上咸蛋黄金沙，香浓而不腻。" },
  { id:"tea-duck",name:"樟茶鸭",category:"冷盘",price:98,tags:["鸭肉"],isPublished:true,image:"/hero-feast.png",description:"茶香入骨，鸭皮酥脆，搭配手工椒盐呈现经典川味。" },
];
const legacyCategoryMap:Record<string,string>={"招牌热菜":"炒菜","江鲜海味":"炒菜","川味经典":"炒菜","时令蔬食":"炒菜","主食甜品":"面条"};
export function normalizeDbDish(row:{id:number;name:string;category:string;price:number;image:string;description:string;tags:string[];isPublished:boolean;isFeatured:boolean}):DishRecord{return{...row,id:String(row.id),category:legacyCategoryMap[row.category]??row.category,tags:Array.isArray(row.tags)?row.tags:[],featured:row.isFeatured}}
