import { describe, expect, it } from "vitest";
import { normalizePrivateKey } from "./firebase-admin";

describe("normalizePrivateKey", () => {
  it("「\\n」という文字を改行に戻す", () => {
    const value =
      "-----BEGIN PRIVATE KEY-----\\nabc\\n-----END PRIVATE KEY-----\\n";

    expect(normalizePrivateKey(value)).toBe(
      "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n",
    );
  });

  it("すでに改行になっている値はそのまま返す", () => {
    const value =
      "-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----\n";

    expect(normalizePrivateKey(value)).toBe(value);
  });
});
