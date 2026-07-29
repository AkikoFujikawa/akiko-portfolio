import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const router = Router();

// プロフィールを1件取得
router.get(
  "/profile",
  async (_req: Request, res: Response) => {
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
  },
);

// 実績を表示順に取得
router.get(
  "/works",
  async (_req: Request, res: Response) => {
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
  },
);

// スキルを表示順に取得
router.get(
  "/skills",
  async (_req: Request, res: Response) => {
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
  },
);

// お問い合わせを登録
router.post(
  "/contact",
  async (req: Request, res: Response) => {
    try {
      const name =
        typeof req.body.name === "string"
          ? req.body.name.trim()
          : "";

      const email =
        typeof req.body.email === "string"
          ? req.body.email.trim()
          : "";

      const message =
        typeof req.body.message === "string"
          ? req.body.message.trim()
          : "";

      if (!name || !email || !message) {
        res.status(400).json({
          error:
            "名前、メールアドレス、お問い合わせ内容は必須です",
        });
        return;
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        res.status(400).json({
          error:
            "メールアドレスの形式が正しくありません",
        });
        return;
      }

      if (
        name.length > 100 ||
        email.length > 254 ||
        message.length > 2000
      ) {
        res.status(400).json({
          error: "入力できる文字数を超えています",
        });
        return;
      }

      const contact = await prisma.contact.create({
        data: {
          name,
          email,
          message,
        },
        select: {
          id: true,
          createdAt: true,
        },
      });

      res.status(201).json({
        message: "お問い合わせを受け付けました",
        contact,
      });
    } catch (error) {
      console.error("お問い合わせ登録エラー:", error);

      res.status(500).json({
        error:
          "お問い合わせの送信に失敗しました",
      });
    }
  },
);

export default router;