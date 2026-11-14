"use server";

import { revalidatePath, updateTag } from "next/cache";
import { adminApiFetch } from "@/lib/admin-api";
import { PORTFOLIO_CACHE_TAG } from "@/lib/portfolio-cache";
import {
  assertMaximumLength,
  parseDisplayOrder,
  parsePositiveId,
  parseTechnologies,
  validateOptionalHttpUrl,
} from "@/lib/admin-form-validation";
import { requireAdmin } from "@/lib/require-admin";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maximumImageSize = 1024 * 1024;

function text(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

// 管理画面で更新したあと、公開画面のキャッシュ（データ・画像）をすぐに捨てる。
// updateTag は、次のアクセスで古いデータを見せずに最新を取りに行く。
function revalidatePortfolio(): void {
  updateTag(PORTFOLIO_CACHE_TAG);
  revalidatePath("/admin");
  revalidatePath("/");
}

function validateImage(value: FormDataEntryValue | null, label: string): File {
  if (!(value instanceof File) || value.size === 0) {
    throw new Error(`${label}を選択してください`);
  }

  if (!allowedImageTypes.includes(value.type)) {
    throw new Error("JPEG、PNG、WebPの画像を選択してください");
  }

  if (value.size > maximumImageSize) {
    throw new Error("画像サイズは1MB以下にしてください");
  }

  return value;
}

function parseWorkForm(formData: FormData) {
  const title = text(formData, "title");
  const description = text(formData, "description");
  const technologies = parseTechnologies(text(formData, "technologies"));
  const githubUrl = validateOptionalHttpUrl(
    text(formData, "githubUrl"),
    "GitHub URL",
  );
  const demoUrl = validateOptionalHttpUrl(text(formData, "demoUrl"), "デモURL");
  const displayOrder = parseDisplayOrder(formData.get("displayOrder"));

  if (!title || !description) {
    throw new Error("タイトル、説明、使用技術は必須です");
  }

  assertMaximumLength(title, "タイトル", 100);
  assertMaximumLength(description, "説明", 2000);

  return {
    title,
    description,
    technologies,
    githubUrl: githubUrl || null,
    demoUrl: demoUrl || null,
    displayOrder,
  };
}

function parseSkillForm(formData: FormData) {
  const name = text(formData, "name");
  const description = text(formData, "description");
  const category = text(formData, "category");
  const displayOrder = parseDisplayOrder(formData.get("displayOrder"));

  if (!name) {
    throw new Error("スキル名は必須です");
  }

  assertMaximumLength(name, "スキル名", 100);
  assertMaximumLength(description, "説明", 500);
  assertMaximumLength(category, "カテゴリー", 100);

  return {
    name,
    description: description || null,
    category: category || null,
    displayOrder,
  };
}

export async function updateProfile(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = parsePositiveId(formData.get("id"), "プロフィール");
  const name = text(formData, "name");
  const nameJa = text(formData, "nameJa");
  const headline = text(formData, "headline");
  const bio = text(formData, "bio");
  const location = text(formData, "location");

  if (!name || !headline || !bio) {
    throw new Error("英語名、見出し、自己紹介は必須です");
  }

  assertMaximumLength(name, "英語名", 100);
  assertMaximumLength(nameJa, "日本語名", 100);
  assertMaximumLength(headline, "見出し", 200);
  assertMaximumLength(bio, "自己紹介", 2000);
  assertMaximumLength(location, "地域", 100);

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

  revalidatePortfolio();
}

export async function createWork(formData: FormData): Promise<void> {
  await requireAdmin();

  await adminApiFetch("/api/admin/works", {
    method: "POST",
    body: JSON.stringify(parseWorkForm(formData)),
  });

  revalidatePortfolio();
}

export async function updateWork(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = parsePositiveId(formData.get("id"), "実績");

  await adminApiFetch(`/api/admin/works/${id}`, {
    method: "PUT",
    body: JSON.stringify(parseWorkForm(formData)),
  });

  revalidatePortfolio();
}

export async function deleteWork(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = parsePositiveId(formData.get("id"), "実績");

  await adminApiFetch(`/api/admin/works/${id}`, {
    method: "DELETE",
  });

  revalidatePortfolio();
}

export async function createSkill(formData: FormData): Promise<void> {
  await requireAdmin();

  await adminApiFetch("/api/admin/skills", {
    method: "POST",
    body: JSON.stringify(parseSkillForm(formData)),
  });

  revalidatePortfolio();
}

export async function updateSkill(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = parsePositiveId(formData.get("id"), "スキル");

  await adminApiFetch(`/api/admin/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(parseSkillForm(formData)),
  });

  revalidatePortfolio();
}

export async function deleteSkill(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = parsePositiveId(formData.get("id"), "スキル");

  await adminApiFetch(`/api/admin/skills/${id}`, {
    method: "DELETE",
  });

  revalidatePortfolio();
}

export async function updateProfileImage(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = parsePositiveId(formData.get("id"), "プロフィール");
  const image = validateImage(formData.get("image"), "プロフィール画像");

  await adminApiFetch(`/api/admin/profile/${id}/image`, {
    method: "PUT",
    headers: {
      "Content-Type": image.type,
    },
    body: await image.arrayBuffer(),
  });

  revalidatePortfolio();
}

export async function updateWorkImage(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = parsePositiveId(formData.get("id"), "実績");
  const image = validateImage(formData.get("image"), "作品画像");

  await adminApiFetch(`/api/admin/works/${id}/image`, {
    method: "PUT",
    headers: {
      "Content-Type": image.type,
    },
    body: await image.arrayBuffer(),
  });

  revalidatePortfolio();
}
