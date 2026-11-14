// 画像を最大1MBまで受け取り、PostgreSQLへ保存します。
import { raw, Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

function parseId(value: string | string[] | undefined): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function getImageContentType(req: Request): string | null {
  const contentType = req
    .header("content-type")
    ?.split(";")[0]
    .trim()
    .toLowerCase();

  if (!contentType || !allowedImageTypes.includes(contentType)) {
    return null;
  }

  return contentType;
}

function hasImageData(body: unknown): body is Buffer {
  return Buffer.isBuffer(body) && body.length > 0;
}

router.put(
  "/profile/:id/image",
  raw({
    type: allowedImageTypes,
    limit: "1mb",
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

      const contentType = getImageContentType(req);

      if (!contentType) {
        res.status(400).json({
          error: "JPEG、PNG、WebPの画像を選択してください",
        });
        return;
      }

      if (!hasImageData(req.body)) {
        res.status(400).json({
          error: "画像データがありません",
        });
        return;
      }

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

      const updatedProfile = await prisma.profile.update({
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

      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error("プロフィール画像更新エラー:", error);

      res.status(500).json({
        error: "プロフィール画像の更新に失敗しました",
      });
    }
  },
);

router.put(
  "/works/:id/image",
  raw({
    type: allowedImageTypes,
    limit: "1mb",
  }),
  async (req: Request, res: Response) => {
    try {
      const id = parseId(req.params.id);

      if (id === null) {
        res.status(400).json({
          error: "実績IDが正しくありません",
        });
        return;
      }

      const contentType = getImageContentType(req);

      if (!contentType) {
        res.status(400).json({
          error: "JPEG、PNG、WebPの画像を選択してください",
        });
        return;
      }

      if (!hasImageData(req.body)) {
        res.status(400).json({
          error: "画像データがありません",
        });
        return;
      }

      const work = await prisma.work.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!work) {
        res.status(404).json({
          error: "実績が見つかりません",
        });
        return;
      }

      const updatedWork = await prisma.work.update({
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

      res.status(200).json(updatedWork);
    } catch (error) {
      console.error("作品画像更新エラー:", error);

      res.status(500).json({
        error: "作品画像の更新に失敗しました",
      });
    }
  },
);

export default router;
