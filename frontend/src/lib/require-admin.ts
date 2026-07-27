//これまでadmin/page.tsxに書いていた認証処理を、管理用のサーバー処理でも再利用
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";

export async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    notFound();
  }

  let uid: string;

  try {
    const decodedToken = await adminAuth.verifySessionCookie(
      sessionCookie,
      true,
    );

    uid = decodedToken.uid;
  } catch (error) {
    console.error("セッション確認エラー:", error);
    notFound();
  }

  if (uid !== process.env.FIREBASE_ADMIN_UID) {
    notFound();
  }
}