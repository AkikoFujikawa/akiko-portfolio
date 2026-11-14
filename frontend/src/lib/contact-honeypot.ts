// ハニーポット（ボット対策の罠）
// フォームに人には見えない入力欄を置き、そこに入力があればボットとみなす。
// ボットに気づかれないよう、保存はせずに「送信しました」と返す。

export const HONEYPOT_FIELD_NAME = "website";

export function isHoneypotFilled(formData: FormData): boolean {
  const value = formData.get(HONEYPOT_FIELD_NAME);

  return typeof value === "string" && value.trim() !== "";
}
