// 公開画面のデータと画像のキャッシュ設定
//
// Render の無料プランは、しばらくアクセスがないと停止し、次の起動に数十秒かかる。
// 公開画面のデータは管理画面で更新したときにしか変わらないため、
// Next.js のサーバー側にとっておき、毎回 Express を呼ばないようにする。

// キャッシュに付ける目印。管理画面で更新したら、この目印のデータをまとめて捨てる
export const PORTFOLIO_CACHE_TAG = "portfolio";

// 管理画面以外で DB が変わった場合に備え、1時間たったら裏側で取り直す
export const PORTFOLIO_REVALIDATE_SECONDS = 3600;

export type PortfolioFetchMode = "cached" | "fresh";

// cached：公開画面用（とっておいたデータを使う）
// fresh：管理画面用（毎回 Express から最新を取る）
export function portfolioFetchOptions(mode: PortfolioFetchMode): RequestInit {
  if (mode === "fresh") {
    return { cache: "no-store" };
  }

  return {
    next: {
      revalidate: PORTFOLIO_REVALIDATE_SECONDS,
      tags: [PORTFOLIO_CACHE_TAG],
    },
  };
}
