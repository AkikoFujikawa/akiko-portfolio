import { describe, expect, it } from "vitest";
import { isValidInternalApiKey } from "./internal-api-key";

describe("isValidInternalApiKey", () => {
  const configuredKey = "correct-key";

  it("同じキーなら true", () => {
    expect(isValidInternalApiKey("correct-key", configuredKey)).toBe(true);
  });

  it("違うキーなら false", () => {
    expect(isValidInternalApiKey("wrong-key!!", configuredKey)).toBe(false);
  });

  it("長さが違うキーでもエラーにならず false", () => {
    expect(isValidInternalApiKey("short", configuredKey)).toBe(false);
  });

  it("キーがない場合は false", () => {
    expect(isValidInternalApiKey(undefined, configuredKey)).toBe(false);
    expect(isValidInternalApiKey("", configuredKey)).toBe(false);
  });
});
