import { describe, expect, it } from "vitest";
import { formatContactDate } from "./contact-date";

describe("formatContactDate", () => {
  it("UTC の日時を日本時間で表示する", () => {
    expect(formatContactDate("2026-11-22T12:30:00.000Z")).toBe(
      "2026/11/22 21:30",
    );
  });

  it("日本時間の深夜0時は 00:00 と表示する", () => {
    expect(formatContactDate("2026-11-22T15:00:00.000Z")).toBe(
      "2026/11/23 00:00",
    );
  });

  it("日時として読めない値は、日時不明と表示する", () => {
    expect(formatContactDate("invalid")).toBe("日時不明");
  });
});
