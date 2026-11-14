"use client";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { type FormEvent, useState } from "react";
import { auth } from "@/lib/firebase";

function getLoginErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "メールアドレスまたはパスワードが正しくありません。";
      case "auth/invalid-email":
        return "メールアドレスの形式が正しくありません。";
      case "auth/too-many-requests":
        return "ログイン試行回数が多すぎます。時間をおいて再度お試しください。";
      case "auth/user-disabled":
        return "このアカウントは無効になっています。";
      default:
        return "ログインに失敗しました。";
    }
  }

  return error instanceof Error ? error.message : "ログインに失敗しました。";
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );
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
          throw new Error("このアカウントは管理者として登録されていません。");
        }

        throw new Error("ログイン情報を確認できませんでした。");
      }

      // ログイン成功後、管理者ページにリダイレクト
      await signOut(auth);
      window.location.href = "/admin";
    } catch (error) {
      console.error(error);

      setMessage(getLoginErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-100 via-stone-100 to-amber-50 px-6">
      <section className="w-full max-w-md rounded-3xl bg-white/80 p-8 shadow-lg backdrop-blur">
        <p className="mb-2 text-sm tracking-widest text-slate-500">ADMIN</p>

        <h1 className="text-2xl font-semibold text-slate-800">
          管理者ログイン
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          管理者用のメールアドレスとパスワードを入力してください。
        </p>

        <form onSubmit={handleLogin} className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">
              メールアドレス
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">
              パスワード
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="rounded-xl border border-slate-300 bg-white px-4 py-3"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-slate-800 px-6 py-3 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        {message && <p className="mt-5 text-sm text-red-700">{message}</p>}
      </section>
    </main>
  );
}
