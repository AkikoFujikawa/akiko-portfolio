////ブラウザ上で画像サイズを確認できるようにする
"use client";

import Image from "next/image";
//エラーメッセージを一時的に記憶する
import { useState, type ChangeEvent } from "react";
import { updateProfileImage } from "./actions";

type ProfileImageFormProps = {
  profileId: number;
  hasImage: boolean;
};
// 1MB
const maximumImageSize = 1024 * 1024;
//画像サイズが大きすぎる場合、エラーメッセージを表示する
export default function ProfileImageForm({
  profileId,
  hasImage,
}: ProfileImageFormProps) {
  const [imageError, setImageError] = useState("");
  //画像が選択されたときに呼び出される関数
  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const image = event.target.files?.[0];

    //画像が選択されていない場合、エラーメッセージをクリアする
    if (!image) {
      setImageError("");
      return;
    }
    //画像サイズが大きすぎる場合、エラーメッセージを表示する
    if (image.size > maximumImageSize) {
      setImageError(
        "画像サイズは1MB以下にしてください",
      );
      //画像サイズが大きすぎる場合、選択を解除する
      event.target.value = "";
      return;
    }

    setImageError("");
  }

  return (
    <section className="mt-10 border-t border-slate-200 pt-8">
      <h2 className="text-2xl font-semibold text-slate-800">
        プロフィール画像を更新
      </h2>

      {hasImage ? (
        <div className="relative mt-6 h-52 w-52 overflow-hidden rounded-full shadow-md">
          <Image
            src="/api/profile-image"
            alt="現在のプロフィール画像"
            fill
            sizes="208px"
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <p className="mt-5 text-slate-600">
          プロフィール画像はまだ登録されていません。
        </p>
      )}

      <form
        action={updateProfileImage}
        className="mt-6 grid gap-5"
      >
        <input
          type="hidden"
          name="id"
          value={profileId}
        />

        <label className="grid gap-2">
          <span className="font-medium text-slate-700">
            画像ファイル
          </span>

          <input
            type="file"
            name="image"
            required
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
          />

          <span className="text-sm text-slate-500">
            JPEG、PNG、WebP形式・1MB以下
          </span>

          {imageError && (
            <p
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {imageError}
            </p>
          )}
        </label>

        <button
          type="submit"
          disabled={Boolean(imageError)}
          className="w-fit rounded-full bg-slate-800 px-7 py-3 font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          プロフィール画像を更新
        </button>
      </form>
    </section>
  );
}