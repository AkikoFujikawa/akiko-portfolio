"use server";
//フォームの内容をNext.jsサーバーで受け取り、認証を確認してからExpressへ送ります。
import { revalidatePath } from "next/cache";
import { adminApiFetch } from "@/lib/admin-api";
import { requireAdmin } from "@/lib/require-admin";

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
}