"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        await signOut(auth);

        if (response.status === 404) {
          throw new Error(
            "このGoogleアカウントは管理者として登録されていません。",
          );
        }

                throw new Error("ログイン情報を確認できませんでした。");
      }

      // ログイン成功後、管理者ページにリダイレクト
      await signOut(auth);
      window.location.href = "/admin";
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Googleログインに失敗しました。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-stone-100 to-amber-50 px-6">
      <section className="w-full max-w-md rounded-3xl bg-white/80 p-8 shadow-lg backdrop-blur">
        <p className="mb-2 text-sm tracking-widest text-slate-500">
          ADMIN
        </p>

        <h1 className="text-2xl font-semibold text-slate-800">
          管理者ログイン
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          ポートフォリオを編集するには、管理者用のGoogleアカウントでログインしてください。
        </p>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="mt-8 w-full rounded-full bg-slate-800 px-6 py-3 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "ログイン中..." : "Googleでログイン"}
        </button>

        {message && (
          <p className="mt-5 text-sm text-red-700">{message}</p>
        )}
      </section>
    </main>
  );
}