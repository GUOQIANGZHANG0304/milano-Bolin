"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "登录失败，请稍后重试。");
        return;
      }
      window.location.replace("/admin");
    } catch {
      setError("网络连接失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-mark"><LockKeyhole size={28} /></div>
        <span className="eyebrow">ADMIN</span>
        <h1>管理员登录</h1>
        <p>请输入管理员密码，进入菜品管理后台。</p>
        <form onSubmit={submit}>
          <label htmlFor="admin-password">管理员密码</label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="请输入密码"
          />
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="button primary" disabled={loading}>
            {loading ? "正在登录…" : "登录后台"}
          </button>
        </form>
        <Link href="/" className="login-back"><ArrowLeft size={16} />返回店铺首页</Link>
      </section>
    </main>
  );
}
