import { describe, expect, it } from "vitest";
import { HONEYPOT_FIELD_NAME, isHoneypotFilled } from "./contact-honeypot";

describe("isHoneypotFilled", () => {
  it("罠の欄が空なら false（人による送信）", () => {
    const formData = new FormData();
    formData.set(HONEYPOT_FIELD_NAME, "");

    expect(isHoneypotFilled(formData)).toBe(false);
  });

  it("罠の欄がなければ false", () => {
    expect(isHoneypotFilled(new FormData())).toBe(false);
  });

  it("罠の欄に入力があれば true（ボットによる送信）", () => {
    const formData = new FormData();
    formData.set(HONEYPOT_FIELD_NAME, "https://spam.example.com");

    expect(isHoneypotFilled(formData)).toBe(true);
  });

  it("空白だけなら false", () => {
    const formData = new FormData();
    formData.set(HONEYPOT_FIELD_NAME, "   ");

    expect(isHoneypotFilled(formData)).toBe(false);
  });
});
