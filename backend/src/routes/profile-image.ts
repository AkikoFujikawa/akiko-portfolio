//画像を最大5MBまで受け取り、PostgreSQLへ保存
import {
  raw,
  Request,
  Response,
  Router,
} from "express";
import { prisma } from "../lib/prisma";

const router = Router();
// 画像のMIMEタイプの制限
const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
// 画像の最大サイズの制限（5MB）
function parseId(
  value: string | string[] | undefined,
): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}
// プロフィール画像の更新エンドポイント
router.put(
  "/profile/:id/image",
  raw({
    type: allowedImageTypes,
    limit: "5mb",
  }),
  async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);

      if (id === null) {
        res.status(400).json({
          error: "プロフィールIDが正しくありません",
        });
        return;
      }
      // リクエストのContent-Typeを取得し、画像のMIMEタイプを確認

      const contentType = req
        .header("content-type")
        ?.split(";")[0]
        .trim()
        .toLowerCase();

      if (
        !contentType ||
        !allowedImageTypes.includes(contentType)
      ) {
        res.status(400).json({
          error:
            "JPEG、PNG、WebPの画像を選択してください",
        });
        return;
      }

      if (
        !Buffer.isBuffer(req.body) ||
        req.body.length === 0
      ) {
        res.status(400).json({
          error: "画像データがありません",
        });
        return;
      }
      // プロフィールが存在するか確認

      const profile = await prisma.profile.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!profile) {
        res.status(404).json({
          error: "プロフィールが見つかりません",
        });
        return;
      }
      // プロフィール画像を更新し、更新されたプロフィール情報を返す

      const updatedProfile =
        await prisma.profile.update({
          where: { id },
          data: {
            imageData: new Uint8Array(req.body),
            imageMimeType: contentType,
          },
          select: {
            id: true,
            imageMimeType: true,
            updatedAt: true,
          },
        });
        // 更新されたプロフィール情報を返す
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error(
        "プロフィール画像更新エラー:",
        error,
      );

      res.status(500).json({
        error:
          "プロフィール画像の更新に失敗しました",
      });
    }
  },
);

export default router;