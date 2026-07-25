import express, { Request, Response } from "express";
import dotenv from "dotenv";

// 環境変数を読み込む
dotenv.config();

//Expressアプリを作る
const app = express();
const PORT = process.env.PORT || 4000; // 環境変数からポート番号を取得、なければ4000を使用

// JSONリクエストのパースを有効にする
app.use(express.json());

// ヘルスチェック用のエンドポイントを作成
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running",
  });
});

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});