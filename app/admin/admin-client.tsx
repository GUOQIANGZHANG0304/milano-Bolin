"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ImageIcon, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { DishRecord } from "@/lib/dishes";

type DishForm = Omit<DishRecord, "id" | "featured" | "price"> & { price: string };
const emptyForm: DishForm = { name: "", category: "招牌热菜", price: "", image: "", description: "", isPublished: true };

function DishFields({ form, setForm, imageFile, setImageFile }: { form: DishForm; setForm: (value: DishForm) => void; imageFile: File | null; setImageFile: (file: File | null) => void }) {
  const set = (key: keyof DishForm, value: string | boolean) => setForm({ ...form, [key]: value });
  return <div className="form-grid">
    <label><span>菜品名称</span><input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="例如：鲜肉小笼包" /></label>
    <label><span>菜品类别</span><select value={form.category} onChange={e => set("category", e.target.value)}><option>招牌热菜</option><option>江鲜海味</option><option>川味经典</option><option>时令蔬食</option><option>主食甜品</option></select></label>
    <label><span>价格（欧元）</span><input required min="0.01" step="0.01" type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="8.00" /></label>
    <label className="publish-field"><span>是否上架</span><select value={form.isPublished ? "published" : "hidden"} onChange={e => set("isPublished", e.target.value === "published")}><option value="published">已上架</option><option value="hidden">已下架</option></select></label>
    <label className="wide upload-field"><span>菜品图片</span><input required={!form.image} type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setImageFile(e.target.files?.[0] ?? null)} /><small>{imageFile ? `已选择：${imageFile.name}` : form.image ? "不选择新文件将保留当前图片" : "支持 JPG、PNG、WebP，最大 5 MB"}</small>{form.image && <img src={form.image} alt="当前菜品预览" />}</label>
    <label className="wide"><span>菜品描述</span><textarea required rows={5} value={form.description} onChange={e => set("description", e.target.value)} placeholder="介绍食材、口味和烹饪特色…" /></label>
  </div>;
}

export function AdminClient() {
  const [view, setView] = useState<"create" | "manage">("create");
  const [form, setForm] = useState<DishForm>(emptyForm);
  const [editing, setEditing] = useState<DishRecord | null>(null);
  const [dishes, setDishes] = useState<DishRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function resolveImage() {
    if (!imageFile) return form.image;
    const upload = new FormData();
    upload.append("image", imageFile);
    const response = await fetch("/api/admin/images", { method: "POST", body: upload });
    if (response.status === 401) { window.location.replace("/admin/login"); throw new Error("请先登录管理员后台。"); }
    const data = await response.json() as { url?: string; error?: string };
    if (!response.ok || !data.url) throw new Error(data.error ?? "图片上传失败");
    return data.url;
  }

  async function loadDishes() {
    setLoading(true);
    const response = await fetch("/api/admin/dishes", { cache: "no-store" });
    if (response.status === 401) return window.location.replace("/admin/login");
    const data = await response.json() as { dishes?: DishRecord[]; error?: string };
    if (response.ok) setDishes(data.dishes ?? []);
    else { setStatus("error"); setMessage(data.error ?? "菜品列表加载失败"); }
    setLoading(false);
  }

  useEffect(() => { if (view === "manage") void loadDishes(); }, [view]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.replace("/admin/login");
  }

  async function createDish(event: FormEvent) {
    event.preventDefault();
    setStatus("saving");
    let image: string;
    try { image = await resolveImage(); } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "图片上传失败"); return; }
    const response = await fetch("/api/dishes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, image, price: Number(form.price) }) });
    if (response.status === 401) return window.location.replace("/admin/login");
    const data = await response.json();
    if (response.ok) { setForm(emptyForm); setImageFile(null); setStatus("success"); setMessage(`“${data.dish.name}”已保存`); }
    else { setStatus("error"); setMessage(data.error ?? "保存失败"); }
  }

  function beginEdit(dish: DishRecord) {
    setEditing(dish);
    setForm({ name: dish.name, category: dish.category, price: String(dish.price), image: dish.image, description: dish.description, isPublished: dish.isPublished });
    setImageFile(null);
    setStatus("idle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveEdit(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    setStatus("saving");
    let image: string;
    try { image = await resolveImage(); } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "图片上传失败"); return; }
    const response = await fetch(`/api/admin/dishes/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, image, price: Number(form.price) }) });
    if (response.status === 401) return window.location.replace("/admin/login");
    const data = await response.json();
    if (response.ok) { setEditing(null); setForm(emptyForm); setImageFile(null); setStatus("success"); setMessage(`“${data.dish.name}”已更新`); await loadDishes(); }
    else { setStatus("error"); setMessage(data.error ?? "修改失败"); }
  }

  async function removeDish(id: string) {
    const response = await fetch(`/api/admin/dishes/${id}`, { method: "DELETE" });
    if (response.status === 401) return window.location.replace("/admin/login");
    const data = await response.json();
    if (response.ok) { setStatus("success"); setMessage("菜品已删除"); await loadDishes(); }
    else { setStatus("error"); setMessage(data.error ?? "删除失败"); }
  }

  async function importSamples() {
    setStatus("saving");
    const response = await fetch("/api/admin/dishes/import-samples", { method: "POST" });
    if (response.status === 401) return window.location.replace("/admin/login");
    const data = await response.json() as { count?: number; error?: string };
    if (response.ok) {
      setStatus("success");
      setMessage(`已将 ${data.count ?? 0} 道案例菜品导入数据库`);
      await loadDishes();
    } else {
      setStatus("error");
      setMessage(data.error ?? "案例导入失败");
    }
  }

  return <div className="admin-shell">
    <aside className="admin-aside">
      <Link href="/" className="brand"><span className="brand-mark">博</span><span><b>米兰博林</b><small>内容管理</small></span></Link>
      <div className="admin-nav">
        <button type="button" className={view === "create" ? "active" : ""} onClick={() => { setView("create"); setEditing(null); setForm(emptyForm); setImageFile(null); }}><Plus size={18} />上架新菜品</button>
        <button type="button" className={view === "manage" ? "active" : ""} onClick={() => { setView("manage"); setEditing(null); }}><ImageIcon size={18} />管理全部菜品</button>
        <button type="button" onClick={logout}><LogOut size={18} />退出登录</button>
      </div>
      <Link href="/" className="back-link"><ArrowLeft size={17} />返回店铺首页</Link>
    </aside>

    <main className="admin-main">
      {view === "create" ? <>
        <div className="admin-heading"><span className="eyebrow">菜品管理</span><h1>上架新菜品</h1><p>填写菜品资料，并决定是否立即在前台展示。</p></div>
        <form className="dish-form" onSubmit={createDish}><DishFields form={form} setForm={setForm} imageFile={imageFile} setImageFile={setImageFile} /><div className="form-actions"><button className="button primary" disabled={status === "saving"}>{status === "saving" ? "正在保存…" : "保存菜品"}</button>{status !== "idle" && status !== "saving" && <p className={`form-message ${status}`}><CheckCircle2 size={18} />{message}</p>}</div></form>
      </> : <>
        <div className="admin-heading"><span className="eyebrow">菜品管理</span><h1>{editing ? "修改菜品" : "全部菜品"}</h1><p>{editing ? "修改资料或调整上下架状态。" : "查看、修改、删除菜品，或控制前台是否展示。"}</p>{!editing && <button type="button" className="import-samples-button" disabled={status === "saving"} onClick={() => void importSamples()}><Plus size={16} />导入缺少的案例菜品</button>}</div>
        {editing ? <form className="dish-form" onSubmit={saveEdit}><DishFields form={form} setForm={setForm} imageFile={imageFile} setImageFile={setImageFile} /><div className="form-actions"><button className="button primary" disabled={status === "saving"}>{status === "saving" ? "正在保存…" : "保存修改"}</button><button type="button" className="button secondary" onClick={() => { setEditing(null); setForm(emptyForm); setImageFile(null); }}>取消</button></div></form> : loading ? <div className="status-card">正在加载菜品…</div> : dishes.length ? <div className="admin-dish-list">{dishes.map(dish => <article className="admin-dish-row" key={dish.id}><img src={dish.image} alt="" /><div className="admin-dish-info"><div><span className={`publish-badge ${dish.isPublished ? "online" : "offline"}`}>{dish.isPublished ? "已上架" : "已下架"}</span><small>{dish.category}</small></div><h2>{dish.name}</h2><p>€{dish.price.toFixed(2)}</p></div><div className="admin-row-actions"><button type="button" onClick={() => beginEdit(dish)}><Pencil size={17} />修改</button><AlertDialog><AlertDialogTrigger asChild><button type="button" className="danger"><Trash2 size={17} />删除</button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>确认删除“{dish.name}”？</AlertDialogTitle><AlertDialogDescription>删除后无法恢复，该菜品也会立即从前台消失。</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => void removeDish(dish.id)}>确认删除</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></div></article>)}</div> : <div className="admin-empty"><ImageIcon size={30} /><h2>数据库中还没有菜品</h2><p>可将前台的 6 道案例菜品导入 D1，导入后即可修改、删除和上下架。</p><button type="button" className="button primary" disabled={status === "saving"} onClick={() => void importSamples()}>{status === "saving" ? "正在导入…" : "导入前台案例菜品"}</button></div>}
        {status !== "idle" && status !== "saving" && !editing && <p className={`form-message admin-list-message ${status}`}><CheckCircle2 size={18} />{message}</p>}
      </>}
    </main>
  </div>;
}
