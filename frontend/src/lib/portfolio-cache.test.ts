import { describe, expect, it } from "vitest";
import {
  PORTFOLIO_CACHE_TAG,
  PORTFOLIO_REVALIDATE_SECONDS,
  portfolioFetchOptions,
} from "./portfolio-cache";

describe("portfolioFetchOptions", () => {
  it("公開画面用は、目印を付けて一定時間とっておく", () => {
    expect(portfolioFetchOptions("cached")).toEqual({
      next: {
        revalidate: PORTFOLIO_REVALIDATE_SECONDS,
        tags: [PORTFOLIO_CACHE_TAG],
      },
    });
  });

  it("管理画面用は、とっておかずに毎回取りに行く", () => {
    expect(portfolioFetchOptions("fresh")).toEqual({ cache: "no-store" });
  });
});
