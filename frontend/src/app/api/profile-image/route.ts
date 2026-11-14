import { connection, NextResponse } from "next/server";
import { portfolioFetchOptions } from "@/lib/portfolio-cache";

export async function GET() {
  // ビルド時ではなく、アクセスがあったときに実行する
  await connection();

  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      {
        error: "バックエンドURLが設定されていません",
      },
      {
        status: 500,
      },
    );
  }

  try {
    const response = await fetch(
      `${backendUrl.replace(/\/$/, "")}/api/profile/image`,
      // 画像も公開画面のデータと同じく、サーバー側にとっておく
      portfolioFetchOptions("cached"),
    );

    if (!response.ok) {
      return new NextResponse(null, {
        status: response.status,
      });
    }

    const imageData = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") ?? "application/octet-stream";

    return new NextResponse(imageData, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("プロフィール画像取得エラー:", error);

    return NextResponse.json(
      {
        error: "プロフィール画像の取得に失敗しました",
      },
      {
        status: 502,
      },
    );
  }
}
