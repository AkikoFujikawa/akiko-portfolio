import { NextResponse } from "next/server";
import { portfolioFetchOptions } from "@/lib/portfolio-cache";

type WorkImageRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: WorkImageRouteContext,
) {
  const { id: idText } = await params;
  const id = Number(idText);

  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      {
        error: "実績IDが正しくありません",
      },
      {
        status: 400,
      },
    );
  }

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
      `${backendUrl.replace(/\/$/, "")}/api/works/${id}/image`,
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
    console.error("作品画像取得エラー:", error);

    return NextResponse.json(
      {
        error: "作品画像の取得に失敗しました",
      },
      {
        status: 502,
      },
    );
  }
}
