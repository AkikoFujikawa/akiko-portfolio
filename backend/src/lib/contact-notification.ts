// お問い合わせが届いたことを、Resend でメール通知する
//
// 応募先の個人情報を外部サービスに渡さないよう、
// メールには名前・メールアドレス・本文を入れない。内容は管理画面で確認する。

const RESEND_EMAILS_URL = "https://api.resend.com/emails";

// 通知が遅れても、処理が止まり続けないようにする
const REQUEST_TIMEOUT_MS = 5000;

const receivedAtFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export type ContactNotificationConfig = {
  apiKey: string;
  from: string;
  to: string;
  adminPageUrl: string;
};

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

// 環境変数を読む。足りない場合は null を返し、通知だけを止める
export function readContactNotificationConfig(
  env: Record<string, string | undefined> = process.env,
): ContactNotificationConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.CONTACT_NOTIFICATION_TO?.trim();
  const from = env.CONTACT_NOTIFICATION_FROM?.trim();
  const adminPageUrl = env.ADMIN_PAGE_URL?.trim();

  if (!apiKey || !to || !from || !adminPageUrl || !isHttpUrl(adminPageUrl)) {
    return null;
  }

  return { apiKey, to, from, adminPageUrl };
}

// 受け取るのは受信日時だけなので、個人情報がメールに入ることはない
export function buildContactNotificationEmail(
  createdAt: Date,
  config: ContactNotificationConfig,
) {
  return {
    from: config.from,
    to: [config.to],
    subject: "【ポートフォリオ】新しいお問い合わせが届きました",
    text: [
      "新しいお問い合わせが届きました。",
      "",
      `受信日時：${receivedAtFormatter.format(createdAt)}（日本時間）`,
      "",
      "内容は管理画面で確認してください。",
      config.adminPageUrl,
      "",
      "このメールは自動送信です。返信しても、お問い合わせの送信者には届きません。",
    ].join("\n"),
  };
}

// 失敗してもエラーを外に投げない（お問い合わせの保存を優先するため）
export async function sendContactNotification(
  createdAt: Date,
  config: ContactNotificationConfig | null = readContactNotificationConfig(),
): Promise<boolean> {
  if (!config) {
    console.warn("メール通知の環境変数が未設定のため、通知を送りませんでした");
    return false;
  }

  try {
    const response = await fetch(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-contact-notifier",
      },
      body: JSON.stringify(buildContactNotificationEmail(createdAt, config)),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      // 応答の本文には宛先などが含まれることがあるので、状態コードだけを残す
      console.error(`メール通知に失敗しました: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    const reason = error instanceof Error ? error.name : "UnknownError";
    console.error(`メール通知に失敗しました: ${reason}`);
    return false;
  }
}
