"use server";

// フォームの内容をNext.jsサーバーで受け取り、
// 認証を確認してからExpressへ送ります。
import { revalidatePath } from "next/cache";
import { adminApiFetch } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/require-admin";

export async function updateProfile(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const nameJa = String(formData.get("nameJa") ?? "").trim();
  const headline = String(
    formData.get("headline") ?? "",
  ).trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const location = String(
    formData.get("location") ?? "",
  ).trim();

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("プロフィールIDが正しくありません");
  }

  if (!name || !headline || !bio) {
    throw new Error(
      "英語名、見出し、自己紹介は必須です",
    );
  }

  await adminApiFetch(`/api/admin/profile/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name,
      nameJa: nameJa || null,
      headline,
      bio,
      location: location || null,
    }),
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/api/portfolio");
}

export async function updateWork(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const id = Number(formData.get("id"));
  const title = String(
    formData.get("title") ?? "",
  ).trim();
  const description = String(
    formData.get("description") ?? "",
  ).trim();
  const technologiesText = String(
    formData.get("technologies") ?? "",
  ).trim();
  const githubUrl = String(
    formData.get("githubUrl") ?? "",
  ).trim();
  const demoUrl = String(
    formData.get("demoUrl") ?? "",
  ).trim();
  const displayOrderValue = Number(
    formData.get("displayOrder") ?? 0,
  );

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("実績IDが正しくありません");
  }

  const technologies = technologiesText
    .split(/[,、]/)
    .map((technology) => technology.trim())
    .filter(Boolean);

  if (!title || !description || technologies.length === 0) {
    throw new Error(
      "タイトル、説明、使用技術は必須です",
    );
  }

  const displayOrder = Number.isInteger(displayOrderValue)
    ? displayOrderValue
    : 0;

  await adminApiFetch(`/api/admin/works/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      title,
      description,
      technologies,
      githubUrl: githubUrl || null,
      demoUrl: demoUrl || null,
      displayOrder,
    }),
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/api/portfolio");
}

export async function createSkill(
  formData: FormData,
): Promise<void> {
  await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const description = String(
    formData.get("description") ?? "",
  ).trim();
  const category = String(
    formData.get("category") ?? "",
  ).trim();
  const displayOrderValue = Number(
    formData.get("displayOrder") ?? 0,
  );

  if (!name) {
    throw new Error("スキル名は必須です");
  }

  const displayOrder = Number.isInteger(displayOrderValue)
    ? displayOrderValue
    : 0;

  await adminApiFetch("/api/admin/skills", {
    method: "POST",
    body: JSON.stringify({
      name,
      description: description || null,
      category: category || null,
      displayOrder,
    }),
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/api/portfolio");
}