const limits = {
  displayOrder: 9999,
  technology: 50,
  technologyCount: 20,
  url: 2048,
} as const;

export function parsePositiveId(
  value: FormDataEntryValue | null,
  label: string,
): number {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`${label}IDが正しくありません`);
  }

  return id;
}

export function parseDisplayOrder(
  value: FormDataEntryValue | null,
): number {
  const displayOrder = Number(value);

  if (
    !Number.isInteger(displayOrder) ||
    displayOrder < 0 ||
    displayOrder > limits.displayOrder
  ) {
    throw new Error(
      `表示順は0から${limits.displayOrder}までの整数で入力してください`,
    );
  }

  return displayOrder;
}

export function validateOptionalHttpUrl(
  value: string,
  label: string,
): string {
  if (!value) {
    return "";
  }

  if (value.length > limits.url) {
    throw new Error(`${label}は${limits.url}文字以内で入力してください`);
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported protocol");
    }
  } catch {
    throw new Error(
      `${label}はhttpまたはhttpsのURLを入力してください`,
    );
  }

  return value;
}

export function parseTechnologies(value: string): string[] {
  const technologies = value
    .split(/[,、]/)
    .map((technology) => technology.trim())
    .filter(Boolean);

  if (technologies.length === 0) {
    throw new Error("使用技術を1つ以上入力してください");
  }

  if (technologies.length > limits.technologyCount) {
    throw new Error(
      `使用技術は${limits.technologyCount}個以内で入力してください`,
    );
  }

  if (
    technologies.some(
      (technology) =>
        technology.length > limits.technology,
    )
  ) {
    throw new Error(
      `使用技術は1項目${limits.technology}文字以内で入力してください`,
    );
  }

  return technologies;
}

export function assertMaximumLength(
  value: string,
  label: string,
  maximumLength: number,
): void {
  if (value.length > maximumLength) {
    throw new Error(
      `${label}は${maximumLength}文字以内で入力してください`,
    );
  }
}
