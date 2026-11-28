import { describe, expect, it } from "vitest";
import { parseId } from "./parse-id";

describe("parseId", () => {
  it("1 以上の整数の文字列を、数値にして返す", () => {
    expect(parseId("1")).toBe(1);
    expect(parseId("12")).toBe(12);
  });

  it("0 やマイナスの数は受け付けない", () => {
    expect(parseId("0")).toBeNull();
    expect(parseId("-3")).toBeNull();
  });

  it("小数や数字でない文字は受け付けない", () => {
    expect(parseId("1.5")).toBeNull();
    expect(parseId("abc")).toBeNull();
  });

  it("値がない、または配列のときは受け付けない", () => {
    expect(parseId(undefined)).toBeNull();
    expect(parseId(["1", "2"])).toBeNull();
  });
});
