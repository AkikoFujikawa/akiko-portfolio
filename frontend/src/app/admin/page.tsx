import { getPortfolioContent } from "@/lib/portfolio-api";
import { requireAdmin } from "@/lib/require-admin";
import LogoutButton from "./logout-button";
import { createSkill, updateProfile } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const { profile, skills } = await getPortfolioContent();

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-stone-100 to-amber-50 px-6 py-16">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white/80 p-8 shadow-lg">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm tracking-widest text-slate-500">
              ADMIN DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-800">
              ポートフォリオ管理
            </h1>
          </div>

          <LogoutButton />
        </div>

        <p className="mt-6 text-slate-600">
          管理者としてログインしています。
        </p>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-semibold text-slate-800">
            プロフィールを編集
          </h2>

          {profile ? (
            <form
              action={updateProfile}
              className="mt-6 grid gap-5"
            >
              <input
                type="hidden"
                name="id"
                value={profile.id}
              />

              <label className="grid gap-2">
                <span className="font-medium text-slate-700">
                  日本語名
                </span>

                <input
                  type="text"
                  name="nameJa"
                  defaultValue={profile.nameJa ?? ""}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder="例：藤川 明子"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-medium text-slate-700">
                  英語名
                </span>

                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={profile.name}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder="例：Akiko Fujikawa"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-medium text-slate-700">
                  見出し
                </span>

                <textarea
                  name="headline"
                  required
                  rows={2}
                  defaultValue={profile.headline}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder={
                    "例：人に寄り添う経験を\nデジタルの力へ"
                  }
                />
              </label>

              <label className="grid gap-2">
                <span className="font-medium text-slate-700">
                  自己紹介
                </span>

                <textarea
                  name="bio"
                  required
                  rows={5}
                  defaultValue={profile.bio}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder="プロフィールの自己紹介を入力してください"
                />
              </label>

              <label className="grid gap-2">
                <span className="font-medium text-slate-700">
                  地域
                </span>

                <input
                  type="text"
                  name="location"
                  defaultValue={profile.location ?? ""}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                  placeholder="例：Ibaraki, Japan"
                />
              </label>

              <button
                type="submit"
                className="w-fit rounded-full bg-slate-800 px-7 py-3 font-medium text-white transition hover:bg-slate-600"
              >
                プロフィールを更新
              </button>
            </form>
          ) : (
            <p className="mt-6 text-slate-600">
              プロフィールが登録されていません。
            </p>
          )}
        </section>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-semibold text-slate-800">
            スキルを登録
          </h2>

          <form
            action={createSkill}
            className="mt-6 grid gap-5"
          >
            <label className="grid gap-2">
              <span className="font-medium text-slate-700">
                スキル名
              </span>

              <input
                type="text"
                name="name"
                required
                className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                placeholder="例：TypeScript"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-medium text-slate-700">
                説明
              </span>

              <textarea
                name="description"
                rows={3}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                placeholder="例：型を利用した安全なコード作成"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-medium text-slate-700">
                カテゴリー
              </span>

              <input
                type="text"
                name="category"
                className="rounded-xl border border-slate-300 bg-white px-4 py-3"
                placeholder="例：Language"
              />
            </label>

            <label className="grid gap-2">
              <span className="font-medium text-slate-700">
                表示順
              </span>

              <input
                type="number"
                name="displayOrder"
                min="0"
                defaultValue={skills.length + 1}
                className="rounded-xl border border-slate-300 bg-white px-4 py-3"
              />
            </label>

            <button
              type="submit"
              className="w-fit rounded-full bg-slate-800 px-7 py-3 font-medium text-white transition hover:bg-slate-600"
            >
              スキルを登録
            </button>
          </form>
        </section>

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-semibold text-slate-800">
            登録済みスキル
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-sky-100 px-4 py-2 text-slate-700"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}