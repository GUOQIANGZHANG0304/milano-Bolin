import { env } from "cloudflare:workers";
import { isAdminRequest } from "@/lib/admin-auth";

const allowedTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const maxSize = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return Response.json({ error: "请先登录管理员后台。" }, { status: 401 });
  }
  if (!env.BUCKET) {
    return Response.json({ error: "图片存储尚未配置，请绑定 Cloudflare R2。" }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("image");
    if (!(file instanceof File)) return Response.json({ error: "请选择图片文件。" }, { status: 400 });
    const extension = allowedTypes[file.type];
    if (!extension) return Response.json({ error: "仅支持 JPG、PNG 或 WebP 图片。" }, { status: 400 });
    if (file.size <= 0 || file.size > maxSize) return Response.json({ error: "图片大小不能超过 5 MB。" }, { status: 400 });

    const key = `${crypto.randomUUID()}.${extension}`;
    await env.BUCKET.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
    return Response.json({ url: `/api/images/${key}` }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "图片上传失败，请稍后重试。" }, { status: 500 });
  }
}
