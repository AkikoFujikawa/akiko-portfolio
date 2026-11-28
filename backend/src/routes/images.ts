import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import { parseId } from "../validation/parse-id";

const router = Router();

router.get("/profile/image", async (_req: Request, res: Response) => {
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

    if (!profile?.imageData || !profile.imageMimeType) {
      res.status(404).json({
        error: "プロフィール画像がありません",
      });
      return;
    }

    res.setHeader("Content-Type", profile.imageMimeType);
    res.setHeader("Cache-Control", "no-store");

    res.status(200).send(Buffer.from(profile.imageData));
  } catch (error) {
    console.error("プロフィール画像取得エラー:", error);

    res.status(500).json({
      error: "プロフィール画像の取得に失敗しました",
    });
  }
});

router.get("/works/:id/image", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        error: "実績IDが正しくありません",
      });
      return;
    }

    const work = await prisma.work.findUnique({
      where: { id },
      select: {
        imageData: true,
        imageMimeType: true,
      },
    });

    if (!work?.imageData || !work.imageMimeType) {
      res.status(404).json({
        error: "作品画像がありません",
      });
      return;
    }

    res.setHeader("Content-Type", work.imageMimeType);
    res.setHeader("Cache-Control", "no-store");

    res.status(200).send(Buffer.from(work.imageData));
  } catch (error) {
    console.error("作品画像取得エラー:", error);

    res.status(500).json({
      error: "作品画像の取得に失敗しました",
    });
  }
});

export default router;
