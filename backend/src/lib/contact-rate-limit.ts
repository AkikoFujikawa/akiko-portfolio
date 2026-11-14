// お問い合わせの回数制限（サイト全体）
// Express から見える送信元は Next.js のサーバーだけなので、
// 送信者ごとではなく「サイト全体で直近◯分に◯件まで」と制限する。
// 件数は DB で数えるため、サーバーが複数台・再起動しても正しく数えられる。

export const CONTACT_LIMIT_WINDOW_MINUTES = 10;
export const CONTACT_LIMIT_MAX_COUNT = 10;

// 数え始める時刻（今から◯分前）
export function getContactWindowStart(now: Date): Date {
  return new Date(now.getTime() - CONTACT_LIMIT_WINDOW_MINUTES * 60 * 1000);
}

export function isContactLimitReached(recentCount: number): boolean {
  return recentCount >= CONTACT_LIMIT_MAX_COUNT;
}
