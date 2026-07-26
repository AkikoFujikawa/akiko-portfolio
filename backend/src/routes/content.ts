import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// プロフィールを1件取得
router.get("/profile", async (_req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.findFirst({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        nameJa: true,
        headline: true,
        bio: true,
        location: true,
        imageMimeType: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(profile);
  } catch (error) {
    console.error("プロフィール取得エラー:", error);
    res.status(500).json({
      error: "プロフィールの取得に失敗しました",
    });
  }
});

// 実績を表示順に取得
router.get("/works", async (_req: Request, res: Response) => {
  try {
    const works = await prisma.work.findMany({
      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          id: "asc",
        },
      ],
      select: {
        id: true,
        title: true,
        description: true,
        technologies: true,
        githubUrl: true,
        demoUrl: true,
        imageMimeType: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(works);
  } catch (error) {
    console.error("実績取得エラー:", error);
    res.status(500).json({
      error: "実績の取得に失敗しました",
    });
  }
});

// スキルを表示順に取得
router.get("/skills", async (_req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        {
          displayOrder: "asc",
        },
        {
          id: "asc",
        },
      ],
    });

    res.status(200).json(skills);
  } catch (error) {
    console.error("スキル取得エラー:", error);
    res.status(500).json({
      error: "スキルの取得に失敗しました",
    });
  }
});

export default router;