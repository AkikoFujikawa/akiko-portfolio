import type { ValidationResult } from "./admin-content";

// 管理画面に一度に表示するお問い合わせの最大件数
export const ADMIN_CONTACT_LIST_LIMIT = 50;

export type ContactReadInput = {
  isRead: boolean;
};

// 既読・未読の切り替えで受け取る値を確認する
export function validateContactReadInput(
  body: unknown,
): ValidationResult<ContactReadInput> {
  if (typeof body !== "object" || body === null) {
    return { success: false, error: "既読状態を指定してください" };
  }

  const { isRead } = body as { isRead?: unknown };

  // "true" などの文字列は受け付けず、true / false だけを通す
  if (typeof isRead !== "boolean") {
    return { success: false, error: "既読状態を指定してください" };
  }

  return { success: true, data: { isRead } };
}
