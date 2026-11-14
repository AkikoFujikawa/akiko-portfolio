import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import contentRouter from "./routes/content";
import adminRouter from "./routes/admin";
import imageRouter from "./routes/images";
import profileImageRouter from "./routes/profile-image";
import { isValidInternalApiKey } from "./lib/internal-api-key";

const app = express();
const PORT = process.env.PORT || 4000;

// セキュリティ用のHTTPヘッダーを付け、X-Powered-By を消す
app.use(helmet());

// JSON形式のリクエストを受け取れるようにする
app.use(express.json());

// サーバーの起動確認用API
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running",
  });
});

// 管理APIへ送られた内部APIキーを確認する
function verifyInternalApiKey(req: Request, res: Response, next: NextFunction) {
  const configuredApiKey = process.env.INTERNAL_API_KEY;

  if (!configuredApiKey) {
    console.error("INTERNAL_API_KEYが設定されていません。");

    res.status(500).json({
      error: "サーバーの設定に問題があります",
    });
    return;
  }

  const receivedApiKey = req.header("x-internal-api-key");

  if (!isValidInternalApiKey(receivedApiKey, configuredApiKey)) {
    console.error("管理APIのINTERNAL_API_KEYが一致しません。");

    res.status(401).json({
      error:
        "管理APIの認証に失敗しました。フロントエンドとバックエンドのINTERNAL_API_KEYを確認してください。",
    });
    return;
  }

  next();
}

// トップページから使用する公開用API
app.use("/api", imageRouter, contentRouter);

// 管理画面から使用する登録・更新・削除API
app.use("/api/admin", verifyInternalApiKey, profileImageRouter, adminRouter);

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
