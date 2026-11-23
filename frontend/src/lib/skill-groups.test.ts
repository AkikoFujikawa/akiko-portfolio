import { describe, expect, it } from "vitest";
import type { Skill } from "@/lib/portfolio-api";
import { groupSkillsByCategory, UNCATEGORIZED_LABEL } from "./skill-groups";

function skill(id: number, category: string | null): Skill {
  return {
    id,
    name: `スキル${id}`,
    description: null,
    category,
    displayOrder: id * 10,
  };
}

function ids(skills: Skill[]): number[] {
  return skills.map(({ id }) => id);
}

describe("groupSkillsByCategory", () => {
  it("カテゴリーごとに分け、最初に出てきた順に並べる", () => {
    const groups = groupSkillsByCategory([
      skill(1, "Language"),
      skill(2, "Frontend"),
      skill(3, "Language"),
    ]);

    expect(groups.map(({ category }) => category)).toEqual([
      "Language",
      "Frontend",
    ]);
    expect(ids(groups[0].skills)).toEqual([1, 3]);
    expect(ids(groups[1].skills)).toEqual([2]);
  });

  it("カテゴリーが空のスキルは、その他として最後に置く", () => {
    const groups = groupSkillsByCategory([
      skill(1, null),
      skill(2, "Tools"),
      skill(3, "   "),
    ]);

    expect(groups.map(({ category }) => category)).toEqual([
      "Tools",
      UNCATEGORIZED_LABEL,
    ]);
    expect(ids(groups[1].skills)).toEqual([1, 3]);
  });

  it("前後の空白が違うだけのカテゴリーは、同じものとして扱う", () => {
    const groups = groupSkillsByCategory([
      skill(1, "Tools"),
      skill(2, " Tools "),
    ]);

    expect(groups).toHaveLength(1);
    expect(ids(groups[0].skills)).toEqual([1, 2]);
  });

  it("スキルがなければ、空の配列を返す", () => {
    expect(groupSkillsByCategory([])).toEqual([]);
  });
});
