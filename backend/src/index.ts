import "dotenv/config";
import express, { Request, Response } from "express";
import contentRouter from "./routes/content";
import adminRouter from "./routes/admin";

const app = express();
const PORT = process.env.PORT || 4000;

// JSON形式のリクエストを受け取れるようにする
app.use(express.json());

// サーバーの起動確認用API
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running",
  });
});

// 公開ページから使用する読み取りAPI
app.use("/api", contentRouter);

// 管理画面から使用する登録・更新・削除API
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});