import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Server Action が受け取れるデータの上限（初期値は 1MB）。
      // 画像の上限は 1MB だが、フォームの送信では区切りや項目名の分だけデータが増える。
      // 1MB ちょうどの画像でも、アプリの入力チェック（分かりやすいメッセージ）まで届くよう、
      // 余裕をもって 2MB にする。
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
