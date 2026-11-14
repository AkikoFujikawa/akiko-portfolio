"use server";

import { isHoneypotFilled } from "@/lib/contact-honeypot";

const SUCCESS_MESSAGE = "お問い合わせを送信しました。ありがとうございます。";

type ContactFormState = {
  success: boolean;
  message: string;
  submittedAt: number;
};

export async function sendContact(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // ボットとみなした送信は保存しない。
  // ボットに見破られないよう、通常と同じ「送信しました」を返す。
  if (isHoneypotFilled(formData)) {
    console.warn(
      "ハニーポットに入力があったため、お問い合わせを保存しませんでした",
    );

    return {
      success: true,
      message: SUCCESS_MESSAGE,
      submittedAt: Date.now(),
    };
  }

  const name = String(formData.get("name") ?? "").trim();

  const email = String(formData.get("email") ?? "").trim();

  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return {
      success: false,
      message: "名前、メールアドレス、お問い合わせ内容を入力してください。",
      submittedAt: 0,
    };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return {
      success: false,
      message: "メールアドレスの形式が正しくありません。",
      submittedAt: 0,
    };
  }

  if (name.length > 100 || email.length > 254 || message.length > 2000) {
    return {
      success: false,
      message: "入力できる文字数を超えています。",
      submittedAt: 0,
    };
  }

  const backendUrl = process.env.BACKEND_URL;
  const internalApiKey = process.env.INTERNAL_API_KEY;

  if (!backendUrl || !internalApiKey) {
    console.error("BACKEND_URLまたはINTERNAL_API_KEYが設定されていません。");

    return {
      success: false,
      message: "現在送信できません。時間をおいてもう一度お試しください。",
      submittedAt: 0,
    };
  }

  try {
    const response = await fetch(
      `${backendUrl.replace(/\/$/, "")}/api/contact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          // Express のお問い合わせAPIは、このキーがないと受け付けない
          "x-internal-api-key": internalApiKey,
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
        cache: "no-store",
      },
    );

    // サイト全体の回数制限にかかった場合
    if (response.status === 429) {
      return {
        success: false,
        message:
          "ただいま送信が混み合っています。時間をおいてもう一度お試しください。",
        submittedAt: 0,
      };
    }

    if (!response.ok) {
      console.error(`お問い合わせAPIエラー: ${response.status}`);

      return {
        success: false,
        message: "お問い合わせの送信に失敗しました。",
        submittedAt: 0,
      };
    }

    return {
      success: true,
      message: SUCCESS_MESSAGE,
      submittedAt: Date.now(),
    };
  } catch (error) {
    console.error("お問い合わせ送信エラー:", error);

    return {
      success: false,
      message: "お問い合わせの送信に失敗しました。",
      submittedAt: 0,
    };
  }
}
