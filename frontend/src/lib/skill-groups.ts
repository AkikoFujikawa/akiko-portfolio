import type { Skill } from "@/lib/portfolio-api";

// カテゴリーが空のスキルをまとめる見出し
export const UNCATEGORIZED_LABEL = "その他";

export type SkillGroup = {
  category: string;
  skills: Skill[];
};

// スキルをカテゴリーごとに分ける。
// 受け取った順番（管理画面の表示順）を保ち、カテゴリーが空のものは最後に置く。
export function groupSkillsByCategory(skills: Skill[]): SkillGroup[] {
  const groups = new Map<string, Skill[]>();
  const uncategorized: Skill[] = [];

  for (const skill of skills) {
    const category = skill.category?.trim();

    if (!category) {
      uncategorized.push(skill);
      continue;
    }

    const group = groups.get(category);

    if (group) {
      group.push(skill);
    } else {
      groups.set(category, [skill]);
    }
  }

  const result = Array.from(groups, ([category, groupSkills]) => ({
    category,
    skills: groupSkills,
  }));

  if (uncategorized.length > 0) {
    result.push({ category: UNCATEGORIZED_LABEL, skills: uncategorized });
  }

  return result;
}
