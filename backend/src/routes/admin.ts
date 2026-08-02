import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import {
  validateProfileInput,
  validateSkillInput,
  validateWorkInput,
} from "../validation/admin-content";

const router = Router();

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

// プロフィールを登録
router.post("/profile", async (req: Request, res: Response) => {
  try {
    const validation = validateProfileInput(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: validation.error,
      });
      return;
    }

    const profile = await prisma.profile.create({
      data: validation.data,
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error("プロフィール登録エラー:", error);
    res.status(500).json({
      error: "プロフィールの登録に失敗しました",
    });
  }
});

// プロフィールを更新
router.put("/profile/:id", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        error: "正しいプロフィールIDを指定してください",
      });
      return;
    }

    const validation = validateProfileInput(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: validation.error,
      });
      return;
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!existingProfile) {
      res.status(404).json({
        error: "プロフィールが見つかりません",
      });
      return;
    }

    const profile = await prisma.profile.update({
      where: { id },
      data: validation.data,
    });

    res.status(200).json(profile);
  } catch (error) {
    console.error("プロフィール更新エラー:", error);
    res.status(500).json({
      error: "プロフィールの更新に失敗しました",
    });
  }
});

// プロフィールを削除
router.delete("/profile/:id", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        error: "正しいプロフィールIDを指定してください",
      });
      return;
    }

    const existingProfile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!existingProfile) {
      res.status(404).json({
        error: "プロフィールが見つかりません",
      });
      return;
    }

    await prisma.profile.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("プロフィール削除エラー:", error);
    res.status(500).json({
      error: "プロフィールの削除に失敗しました",
    });
  }
});

// 実績を登録
router.post("/works", async (req: Request, res: Response) => {
  try {
    const validation = validateWorkInput(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: validation.error,
      });
      return;
    }

    const work = await prisma.work.create({
      data: validation.data,
    });

    res.status(201).json(work);
  } catch (error) {
    console.error("実績登録エラー:", error);
    res.status(500).json({
      error: "実績の登録に失敗しました",
    });
  }
});

// 実績を更新
router.put("/works/:id", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        error: "正しい実績IDを指定してください",
      });
      return;
    }

    const validation = validateWorkInput(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: validation.error,
      });
      return;
    }

    const existingWork = await prisma.work.findUnique({
      where: { id },
    });

    if (!existingWork) {
      res.status(404).json({
        error: "実績が見つかりません",
      });
      return;
    }

    const work = await prisma.work.update({
      where: { id },
      data: validation.data,
    });

    res.status(200).json(work);
  } catch (error) {
    console.error("実績更新エラー:", error);
    res.status(500).json({
      error: "実績の更新に失敗しました",
    });
  }
});

// 実績を削除
router.delete("/works/:id", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        error: "正しい実績IDを指定してください",
      });
      return;
    }

    const existingWork = await prisma.work.findUnique({
      where: { id },
    });

    if (!existingWork) {
      res.status(404).json({
        error: "実績が見つかりません",
      });
      return;
    }

    await prisma.work.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("実績削除エラー:", error);
    res.status(500).json({
      error: "実績の削除に失敗しました",
    });
  }
});

// スキルを登録
router.post("/skills", async (req: Request, res: Response) => {
  try {
    const validation = validateSkillInput(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: validation.error,
      });
      return;
    }

    const skill = await prisma.skill.create({
      data: validation.data,
    });

    res.status(201).json(skill);
  } catch (error) {
    console.error("スキル登録エラー:", error);
    res.status(500).json({
      error: "スキルの登録に失敗しました",
    });
  }
});

// スキルを更新
router.put("/skills/:id", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        error: "正しいスキルIDを指定してください",
      });
      return;
    }

    const validation = validateSkillInput(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: validation.error,
      });
      return;
    }

    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      res.status(404).json({
        error: "スキルが見つかりません",
      });
      return;
    }

    const skill = await prisma.skill.update({
      where: { id },
      data: validation.data,
    });

    res.status(200).json(skill);
  } catch (error) {
    console.error("スキル更新エラー:", error);
    res.status(500).json({
      error: "スキルの更新に失敗しました",
    });
  }
});

// スキルを削除
router.delete("/skills/:id", async (req: Request, res: Response) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      res.status(400).json({
        error: "正しいスキルIDを指定してください",
      });
      return;
    }

    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      res.status(404).json({
        error: "スキルが見つかりません",
      });
      return;
    }

    await prisma.skill.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("スキル削除エラー:", error);
    res.status(500).json({
      error: "スキルの削除に失敗しました",
    });
  }
});

export default router;
