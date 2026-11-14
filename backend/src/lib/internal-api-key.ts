import { createHash, timingSafeEqual } from "node:crypto";

// 内部APIキーが正しいかを確認する。
// 「!==」で比べると、何文字目まで合っているかで処理時間がわずかに変わり、
// その差からキーを推測される可能性がある。
// timingSafeEqual は、どこが違っても同じ時間で比べる。
export function isValidInternalApiKey(
  receivedKey: string | undefined,
  configuredKey: string,
): boolean {
  if (!receivedKey) {
    return false;
  }

  // timingSafeEqual は同じ長さの値しか比べられないため、
  // 両方をハッシュ（いつも32バイト）にそろえてから比べる。
  const receivedHash = createHash("sha256").update(receivedKey).digest();
  const configuredHash = createHash("sha256").update(configuredKey).digest();

  return timingSafeEqual(receivedHash, configuredHash);
}
