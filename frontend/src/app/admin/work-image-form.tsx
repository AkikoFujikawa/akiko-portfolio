"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { updateWorkImage } from "./actions";

type WorkImageFormProps = {
  workId: number;
  workTitle: string;
  hasImage: boolean;
};

const maximumImageSize = 1024 * 1024;

export default function WorkImageForm({
  workId,
  workTitle,
  hasImage,
}: WorkImageFormProps) {
  const [imageError, setImageError] = useState("");

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const image = event.target.files?.[0];

    if (!image) {
      setImageError("");
      return;
    }

    if (image.size > maximumImageSize) {
      setImageError(
        "画像サイズは1MB以下にしてください",
      );
      event.target.value = "";
      return;
    }

    setImageError("");
  }

  return (
    <div className="border-b border-slate-200 pb-6">
      <h3 className="text-lg font-semibold text-slate-800">
        {workTitle}の作品画像
      </h3>

      {hasImage ? (
        <div className="relative mt-5 aspect-video w-full max-w-md overflow-hidden rounded-xl bg-white shadow-sm">
          <Image
            src={`/api/work-image/${workId}`}
            alt={`${workTitle}の現在の作品画像`}
            fill
            sizes="(min-width: 768px) 448px, calc(100vw - 96px)"
            unoptimized
            className="object-cover"
          />
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">
          作品画像はまだ登録されていません。
        </p>
      )}

      <form
        action={updateWorkImage}
        className="mt-5 grid gap-4"
      >
        <input type="hidden" name="id" value={workId} />

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
          作品画像を更新
        </button>
      </form>
    </div>
  );
}
