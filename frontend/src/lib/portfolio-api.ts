//Next.jsサーバーからExpressへ問い合わせる共通窓口
export type Profile = {
  id: number;
  name: string;
  nameJa: string | null;
  headline: string;
  bio: string;
  location: string | null;
  imageMimeType: string | null;
};
//Express APIのレスポンスの型定義
export type Work = {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  demoUrl: string | null;
  imageMimeType: string | null;
  displayOrder: number;
};

export type Skill = {
  id: number;
  name: string;
  description: string | null;
  category: string | null;
  displayOrder: number;
};
//Express APIのURLを取得する関数
function getBackendUrl(): string {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    throw new Error("BACKEND_URLが設定されていません");
  }

  return backendUrl.replace(/\/$/, "");
}
//Express APIを呼び出す共通関数
async function fetchBackend<T>(path: string): Promise<T> {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Express APIの取得に失敗しました: ${response.status}`,
    );
  }

  return (await response.json()) as T;
}
//ポートフォリオのコンテンツを取得する関数
export async function getPortfolioContent() {
  const [profile, works, skills] = await Promise.all([
    fetchBackend<Profile | null>("/api/profile"),
    fetchBackend<Work[]>("/api/works"),
    fetchBackend<Skill[]>("/api/skills"),
  ]);

  return {
    profile,
    works,
    skills,
  };
}