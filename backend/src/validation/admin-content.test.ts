import { describe, expect, it } from "vitest";
import {
  validateProfileInput,
  validateSkillInput,
  validateWorkInput,
} from "./admin-content";

describe("validateProfileInput", () => {
  it("正しいプロフィールを受け付ける", () => {
    const result = validateProfileInput({
      name: "Akiko Fujikawa",
      nameJa: "藤川 明子",
      headline: "Web Developer",
      bio: "自己紹介",
      location: "Ibaraki, Japan",
    });

    expect(result.success).toBe(true);
  });

  it("長すぎる英語名を拒否する", () => {
    const result = validateProfileInput({
      name: "a".repeat(101),
      headline: "Web Developer",
      bio: "自己紹介",
    });

    expect(result).toEqual({
      success: false,
      error: "英語名は100文字以内で入力してください",
    });
  });
});

describe("validateWorkInput", () => {
  const validWork = {
    title: "家計簿アプリ",
    description: "収入と支出を管理します",
    technologies: ["Next.js", "Express"],
    githubUrl: "https://github.com/example/repository",
    demoUrl: "",
    displayOrder: 1,
  };

  it("正しい実績を受け付ける", () => {
    expect(validateWorkInput(validWork).success).toBe(true);
  });

  it("http・https以外のURLを拒否する", () => {
    const result = validateWorkInput({
      ...validWork,
      demoUrl: "javascript:alert(1)",
    });

    expect(result.success).toBe(false);
  });

  it("負の表示順を拒否する", () => {
    const result = validateWorkInput({
      ...validWork,
      displayOrder: -1,
    });

    expect(result.success).toBe(false);
  });

  it("空の使用技術を拒否する", () => {
    const result = validateWorkInput({
      ...validWork,
      technologies: [],
    });

    expect(result.success).toBe(false);
  });
});

describe("validateSkillInput", () => {
  it("正しいスキルを受け付ける", () => {
    const result = validateSkillInput({
      name: "TypeScript",
      description: "型を使った開発",
      category: "Language",
      displayOrder: 1,
    });

    expect(result.success).toBe(true);
  });

  it("小数の表示順を拒否する", () => {
    const result = validateSkillInput({
      name: "TypeScript",
      displayOrder: 1.5,
    });

    expect(result.success).toBe(false);
  });
});
