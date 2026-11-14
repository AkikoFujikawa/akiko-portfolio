// お問い合わせを登録する
// index.ts で内部APIキーの確認を通してから呼ばれるため、Next.js のサーバーからしか使えない。
import { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import {
  getContactWindowStart,
  isContactLimitReached,
} from "../lib/contact-rate-limit";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

    const email =
      typeof req.body.email === "string" ? req.body.email.trim() : "";

    const message =
      typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (!name || !email || !message) {
      res.status(400).json({
        error: "名前、メールアドレス、お問い合わせ内容は必須です",
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      res.status(400).json({
        error: "メールアドレスの形式が正しくありません",
      });
      return;
    }

    if (name.length > 100 || email.length > 254 || message.length > 2000) {
      res.status(400).json({
        error: "入力できる文字数を超えています",
      });
      return;
    }

    // 直近の件数を数え、上限に達していたら保存しない
    const recentCount = await prisma.contact.count({
      where: {
        createdAt: {
          gte: getContactWindowStart(new Date()),
        },
      },
    });

    if (isContactLimitReached(recentCount)) {
      console.warn("お問い合わせの回数制限に達しました");

      res.status(429).json({
        error: "送信が混み合っています",
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
      error: "お問い合わせの送信に失敗しました",
    });
  }
});

export default router;
