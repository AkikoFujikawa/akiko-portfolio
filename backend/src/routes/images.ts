import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

router.get(
  "/profile/image",
  async (_req: Request, res: Response) => {
    try {
      const profile = await prisma.profile.findFirst({
        orderBy: {
          id: "asc",
        },
        select: {
          imageData: true,
          imageMimeType: true,
        },
      });

      if (
        !profile?.imageData ||
        !profile.imageMimeType
      ) {
        res.status(404).json({
          error: "プロフィール画像がありません",
        });
        return;
      }

      res.setHeader(
        "Content-Type",
        profile.imageMimeType,
      );
      res.setHeader("Cache-Control", "no-store");

      res
        .status(200)
        .send(Buffer.from(profile.imageData));
    } catch (error) {
      console.error(
        "プロフィール画像取得エラー:",
        error,
      );

      res.status(500).json({
        error:
          "プロフィール画像の取得に失敗しました",
      });
    }
  },
);

export default router;