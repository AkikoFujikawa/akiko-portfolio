type ValidationSuccess<T> = {
  success: true;
  data: T;
};

type ValidationFailure = {
  success: false;
  error: string;
};

export type ValidationResult<T> =
  | ValidationSuccess<T>
  | ValidationFailure;

export type ProfileInput = {
  name: string;
  nameJa: string | null;
  headline: string;
  bio: string;
  location: string | null;
};

export type WorkInput = {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  displayOrder: number;
};

export type SkillInput = {
  name: string;
  description: string | null;
  category: string | null;
  displayOrder: number;
};

const limits = {
  profile: {
    name: 100,
    nameJa: 100,
    headline: 200,
    bio: 2000,
    location: 100,
  },
  work: {
    title: 100,
    description: 2000,
    technology: 50,
    technologyCount: 20,
    url: 2048,
  },
  skill: {
    name: 100,
    description: 500,
    category: 100,
  },
  displayOrder: 9999,
} as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requiredText(
  value: unknown,
  label: string,
  maximumLength: number,
): ValidationResult<string> {
  if (typeof value !== "string" || value.trim() === "") {
    return {
      success: false,
      error: `${label}は必須です`,
    };
  }

  const text = value.trim();

  if (text.length > maximumLength) {
    return {
      success: false,
      error: `${label}は${maximumLength}文字以内で入力してください`,
    };
  }

  return {
    success: true,
    data: text,
  };
}

function optionalText(
  value: unknown,
  label: string,
  maximumLength: number,
): ValidationResult<string | null> {
  if (value === undefined || value === null || value === "") {
    return {
      success: true,
      data: null,
    };
  }

  if (typeof value !== "string") {
    return {
      success: false,
      error: `${label}を正しく入力してください`,
    };
  }

  const text = value.trim();

  if (text === "") {
    return {
      success: true,
      data: null,
    };
  }

  if (text.length > maximumLength) {
    return {
      success: false,
      error: `${label}は${maximumLength}文字以内で入力してください`,
    };
  }

  return {
    success: true,
    data: text,
  };
}

function optionalHttpUrl(
  value: unknown,
  label: string,
): ValidationResult<string | null> {
  const textResult = optionalText(
    value,
    label,
    limits.work.url,
  );

  if (!textResult.success || textResult.data === null) {
    return textResult;
  }

  try {
    const url = new URL(textResult.data);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported protocol");
    }
  } catch {
    return {
      success: false,
      error: `${label}はhttpまたはhttpsのURLを入力してください`,
    };
  }

  return textResult;
}

function displayOrder(
  value: unknown,
): ValidationResult<number> {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0 ||
    value > limits.displayOrder
  ) {
    return {
      success: false,
      error: `表示順は0から${limits.displayOrder}までの整数で入力してください`,
    };
  }

  return {
    success: true,
    data: value,
  };
}

export function validateProfileInput(
  value: unknown,
): ValidationResult<ProfileInput> {
  if (!isObject(value)) {
    return {
      success: false,
      error: "プロフィールを正しく入力してください",
    };
  }

  const name = requiredText(
    value.name,
    "英語名",
    limits.profile.name,
  );
  const nameJa = optionalText(
    value.nameJa,
    "日本語名",
    limits.profile.nameJa,
  );
  const headline = requiredText(
    value.headline,
    "見出し",
    limits.profile.headline,
  );
  const bio = requiredText(
    value.bio,
    "自己紹介",
    limits.profile.bio,
  );
  const location = optionalText(
    value.location,
    "地域",
    limits.profile.location,
  );

  if (!name.success) return name;
  if (!nameJa.success) return nameJa;
  if (!headline.success) return headline;
  if (!bio.success) return bio;
  if (!location.success) return location;

  return {
    success: true,
    data: {
      name: name.data,
      nameJa: nameJa.data,
      headline: headline.data,
      bio: bio.data,
      location: location.data,
    },
  };
}

export function validateWorkInput(
  value: unknown,
): ValidationResult<WorkInput> {
  if (!isObject(value)) {
    return {
      success: false,
      error: "実績を正しく入力してください",
    };
  }

  const title = requiredText(
    value.title,
    "タイトル",
    limits.work.title,
  );
  const description = requiredText(
    value.description,
    "説明",
    limits.work.description,
  );
  const githubUrl = optionalHttpUrl(value.githubUrl, "GitHub URL");
  const demoUrl = optionalHttpUrl(value.demoUrl, "デモURL");
  const order = displayOrder(value.displayOrder);

  if (!title.success) return title;
  if (!description.success) return description;
  if (!githubUrl.success) return githubUrl;
  if (!demoUrl.success) return demoUrl;
  if (!order.success) return order;

  if (!Array.isArray(value.technologies)) {
    return {
      success: false,
      error: "使用技術を正しく入力してください",
    };
  }

  const technologies = value.technologies
    .filter((technology): technology is string =>
      typeof technology === "string",
    )
    .map((technology) => technology.trim())
    .filter(Boolean);

  if (
    technologies.length === 0 ||
    technologies.length !== value.technologies.length
  ) {
    return {
      success: false,
      error: "使用技術を1つ以上入力してください",
    };
  }

  if (technologies.length > limits.work.technologyCount) {
    return {
      success: false,
      error: `使用技術は${limits.work.technologyCount}個以内で入力してください`,
    };
  }

  if (
    technologies.some(
      (technology) =>
        technology.length > limits.work.technology,
    )
  ) {
    return {
      success: false,
      error: `使用技術は1項目${limits.work.technology}文字以内で入力してください`,
    };
  }

  return {
    success: true,
    data: {
      title: title.data,
      description: description.data,
      technologies,
      githubUrl: githubUrl.data,
      demoUrl: demoUrl.data,
      displayOrder: order.data,
    },
  };
}

export function validateSkillInput(
  value: unknown,
): ValidationResult<SkillInput> {
  if (!isObject(value)) {
    return {
      success: false,
      error: "スキルを正しく入力してください",
    };
  }

  const name = requiredText(
    value.name,
    "スキル名",
    limits.skill.name,
  );
  const description = optionalText(
    value.description,
    "説明",
    limits.skill.description,
  );
  const category = optionalText(
    value.category,
    "カテゴリー",
    limits.skill.category,
  );
  const order = displayOrder(value.displayOrder);

  if (!name.success) return name;
  if (!description.success) return description;
  if (!category.success) return category;
  if (!order.success) return order;

  return {
    success: true,
    data: {
      name: name.data,
      description: description.data,
      category: category.data,
      displayOrder: order.data,
    },
  };
}
