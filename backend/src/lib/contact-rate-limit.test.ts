import { describe, expect, it } from "vitest";
import {
  CONTACT_LIMIT_MAX_COUNT,
  getContactWindowStart,
  isContactLimitReached,
} from "./contact-rate-limit";

describe("getContactWindowStart", () => {
  it("10分前の時刻を返す", () => {
    const now = new Date("2026-11-14T12:00:00.000Z");

    expect(getContactWindowStart(now).toISOString()).toBe(
      "2026-11-14T11:50:00.000Z",
    );
  });
});

describe("isContactLimitReached", () => {
  it("上限より少なければ受け付ける", () => {
    expect(isContactLimitReached(CONTACT_LIMIT_MAX_COUNT - 1)).toBe(false);
  });

  it("上限に達したら受け付けない", () => {
    expect(isContactLimitReached(CONTACT_LIMIT_MAX_COUNT)).toBe(true);
    expect(isContactLimitReached(CONTACT_LIMIT_MAX_COUNT + 1)).toBe(true);
  });
});
