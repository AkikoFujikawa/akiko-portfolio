import { NextResponse } from "next/server";
import { getPortfolioContent } from "@/lib/portfolio-api";

export async function GET() {
  try {
    const content = await getPortfolioContent();

    return NextResponse.json(content);
  } catch (error) {
    console.error("ポートフォリオ取得エラー:", error);

    return NextResponse.json(
      {
        error: "ポートフォリオの取得に失敗しました",
      },
      {
        status: 502,
      },
    );
  }
}