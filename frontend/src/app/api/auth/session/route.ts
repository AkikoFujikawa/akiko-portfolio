import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
// セッションの有効期限を5日間に設定
const SESSION_EXPIRES_IN = 60 * 60 * 24 * 5 * 1000;
// POSTメソッドでセッションを作成するエンドポイント
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      idToken?: string;
    };

    if (!body.idToken) {
      return NextResponse.json(
        { error: "IDトークンがありません。" },
        { status: 400 },
      );
    }
    // Firebase Admin SDKを使ってIDトークンを検証し、ユーザー情報を取得
    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(body.idToken);
    const adminUid = process.env.FIREBASE_ADMIN_UID;

    if (!adminUid) {
      console.error("FIREBASE_ADMIN_UIDが設定されていません。");

      return NextResponse.json(
        { error: "サーバーの設定に問題があります。" },
        { status: 500 },
      );
    }

    if (decodedToken.uid !== adminUid) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
    // セッションの有効期限を確認し、5分以上経過している場合は再ログインを促す
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (nowInSeconds - decodedToken.auth_time > 5 * 60) {
      return NextResponse.json(
        { error: "もう一度ログインしてください。" },
        { status: 401 },
      );
    }
    // セッションCookieを作成し、HTTPレスポンスにセット
    const sessionCookie = await adminAuth.createSessionCookie(body.idToken, {
      expiresIn: SESSION_EXPIRES_IN,
    });
    // セッションCookieをHTTPレスポンスにセットして返す
    const response = NextResponse.json({ success: true });

    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRES_IN / 1000,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("セッション作成エラー:", error);

    return NextResponse.json(
      { error: "ログイン情報を確認できませんでした。" },
      { status: 401 },
    );
  }
}
