import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { adminAuth } from "@/lib/firebase-admin";
import LogoutButton from "./logout-button";

export default async function AdminPage() {
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-stone-100 to-amber-50 px-6 py-16">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white/80 p-8 shadow-lg">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm tracking-widest text-slate-500">
              ADMIN DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-800">
              ポートフォリオ管理
            </h1>
          </div>

          <LogoutButton />
        </div>

        <p className="mt-6 text-slate-600">
          管理者としてログインしています。
        </p>
      </section>
    </main>
  );
}