import "dotenv/config";
import express, {
  NextFunction,
  Request,
  Response,
} from "express";
import contentRouter from "./routes/content";
import adminRouter from "./routes/admin";
import imageRouter from "./routes/images";
import profileImageRouter from "./routes/profile-image";

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

// 管理APIへ送られた内部APIキーを確認する
function verifyInternalApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const configuredApiKey =
    process.env.INTERNAL_API_KEY;

  if (!configuredApiKey) {
    console.error(
      "INTERNAL_API_KEYが設定されていません。",
    );

    res.status(500).json({
      error: "サーバーの設定に問題があります",
    });
    return;
  }

  const receivedApiKey = req.header(
    "x-internal-api-key",
  );

  if (receivedApiKey !== configuredApiKey) {
    res.status(404).json({
      error: "Not Found",
    });
    return;
  }

  next();
}

// トップページから使用する公開用API
app.use("/api", imageRouter, contentRouter);

// 管理画面から使用する登録・更新・削除API
app.use(
  "/api/admin",
  verifyInternalApiKey,
  profileImageRouter,
  adminRouter,
);

app.listen(PORT, () => {
  console.log(
    `Backend server is running on http://localhost:${PORT}`,
  );
});