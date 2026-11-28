// URL の「/skills/12」などに含まれる番号を、正しい ID か確かめて数値にする。
// 1 以上の整数でなければ null を返す（呼び出し側で 400 を返す）。
export function parseId(value: string | string[] | undefined): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}
