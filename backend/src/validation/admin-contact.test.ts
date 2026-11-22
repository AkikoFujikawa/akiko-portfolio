import { describe, expect, it } from "vitest";
import { validateContactReadInput } from "./admin-contact";

describe("validateContactReadInput", () => {
  it("true を受け付ける", () => {
    expect(validateContactReadInput({ isRead: true })).toEqual({
      success: true,
      data: { isRead: true },
    });
  });

  it("false を受け付ける", () => {
    expect(validateContactReadInput({ isRead: false })).toEqual({
      success: true,
      data: { isRead: false },
    });
  });

  it("文字列の true を拒否する", () => {
    expect(validateContactReadInput({ isRead: "true" }).success).toBe(false);
  });

  it("値がない場合を拒否する", () => {
    expect(validateContactReadInput({}).success).toBe(false);
    expect(validateContactReadInput(undefined).success).toBe(false);
    expect(validateContactReadInput(null).success).toBe(false);
  });
});
