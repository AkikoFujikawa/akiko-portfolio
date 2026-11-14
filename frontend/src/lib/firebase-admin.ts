// サーバー側で Firebase Admin SDK を使う準備をする。
// 鍵ファイルではなく環境変数から認証情報を読むので、Vercel でも動く。
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

// 環境変数の秘密鍵を、Firebase が読める形にそろえる。
// 「\n」という文字で保存された改行を、本物の改行に戻す。
export function normalizePrivateKey(value: string): string {
  return value.replace(/\\n/g, "\n");
}

function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name}が設定されていません`);
  }

  return value;
}

// 初めて使うときに1回だけ初期化する。
// ファイルを読み込んだ時点では初期化しないので、
// 環境変数がない環境（CIなど）でもビルドが止まらない。
function getAdminApp(): App {
  const existingApp = getApps()[0];

  if (existingApp) {
    return existingApp;
  }

  return initializeApp({
    credential: cert({
      projectId: readRequiredEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
      clientEmail: readRequiredEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: normalizePrivateKey(readRequiredEnv("FIREBASE_PRIVATE_KEY")),
    }),
  });
}

export function getAdminAuth(): Auth {
  return getAuth(getAdminApp());
}
