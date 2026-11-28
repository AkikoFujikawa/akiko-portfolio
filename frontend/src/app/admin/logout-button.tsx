"use client";

import { signOut } from "firebase/auth";
import { useState } from "react";
import { auth } from "@/lib/firebase";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("ログアウトに失敗しました。");
      }

      await signOut(auth);
      // ブラウザに残った管理画面のデータを確実に消すため、ページ全体を読み込み直す
      // （router.push だとデータが残り、「戻る」で管理画面が見えるおそれがある）
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/admin/login";
    } catch (error) {
      console.error(error);
      alert("ログアウトに失敗しました。");
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-full border border-slate-300 px-5 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
    >
      {isLoading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}
