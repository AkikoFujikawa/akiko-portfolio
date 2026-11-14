"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendContact } from "./contact-actions";

const initialState = {
  success: false,
  message: "",
  submittedAt: 0,
};

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    sendContact,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success, state.submittedAt]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-8 grid gap-5 text-left"
    >
      <label className="grid gap-2">
        <span className="font-medium">お名前</span>

        <input
          type="text"
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          className="rounded-xl border border-white/60 bg-white/65 px-4 py-3 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
        />
      </label>

      <label className="grid gap-2">
        <span className="font-medium">メールアドレス</span>

        <input
          type="email"
          name="email"
          required
          maxLength={254}
          autoComplete="email"
          className="rounded-xl border border-white/60 bg-white/65 px-4 py-3 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
        />
      </label>

      <label className="grid gap-2">
        <span className="font-medium">お問い合わせ内容</span>

        <textarea
          name="message"
          required
          maxLength={2000}
          rows={6}
          className="rounded-xl border border-white/60 bg-white/65 px-4 py-3 outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
        />
      </label>

      {state.message && (
        <p
          aria-live="polite"
          className={
            state.success
              ? "font-medium text-emerald-700"
              : "font-medium text-red-600"
          }
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-fit rounded-full bg-white/65 px-8 py-3 text-[#4a4a4a] shadow-sm ring-1 ring-white/60 transition hover:-translate-y-1 hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
