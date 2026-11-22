import { describe, expect, it } from "vitest";
import {
  parseContactRead,
  parseDisplayOrder,
  parseTechnologies,
  validateOptionalHttpUrl,
} from "./admin-form-validation";

describe("parseContactRead", () => {
  it("true と false の文字列を真偽値にする", () => {
    expect(parseContactRead("true")).toBe(true);
    expect(parseContactRead("false")).toBe(false);
  });

  it("それ以外の値を拒否する", () => {
    expect(() => parseContactRead("yes")).toThrow("既読状態が正しくありません");
    expect(() => parseContactRead(null)).toThrow("既読状態が正しくありません");
  });
});

describe("parseDisplayOrder", () => {
  it("0以上の整数を受け付ける", () => {
    expect(parseDisplayOrder("2")).toBe(2);
  });

  it("負の数を拒否する", () => {
    expect(() => parseDisplayOrder("-1")).toThrow(
      "表示順は0から9999までの整数で入力してください",
    );
  });
});

describe("validateOptionalHttpUrl", () => {
  it("空欄を受け付ける", () => {
    expect(validateOptionalHttpUrl("", "デモURL")).toBe("");
  });

  it("https URLを受け付ける", () => {
    const url = "https://example.com/demo";

    expect(validateOptionalHttpUrl(url, "デモURL")).toBe(url);
  });

  it("不正なプロトコルを拒否する", () => {
    expect(() =>
      validateOptionalHttpUrl("javascript:alert(1)", "デモURL"),
    ).toThrow("デモURLはhttpまたはhttpsのURLを入力してください");
  });
});

describe("parseTechnologies", () => {
  it("カンマ区切りを配列へ変換する", () => {
    expect(parseTechnologies("Next.js, TypeScript、Express")).toEqual([
      "Next.js",
      "TypeScript",
      "Express",
    ]);
  });

  it("空欄を拒否する", () => {
    expect(() => parseTechnologies("  ")).toThrow(
      "使用技術を1つ以上入力してください",
    );
  });
});
