import Link from "next/link";
import { getPortfolioContent } from "@/lib/portfolio-api";
import { requireAdmin } from "@/lib/require-admin";
import LogoutButton from "./logout-button";
import ProfileImageForm from "./profile-image-form";
import {
  createSkill,
  updateProfile,
  updateWork,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();

  const { profile, works, skills } =
    await getPortfolioContent();

  const inputClassName =
    "rounded-xl border border-slate-300 bg-white px-4 py-3";

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-stone-100 to-amber-50 px-6 py-16">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white/80 p-8 shadow-lg">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm tracking-widest text-slate-500">
              ADMIN DASHBOARD
            </p>

            <h1 className="mt-2 text-3xl font-semibold text-slate-800">
              ポートフォリオ管理
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            {/* 公開サイトを別タブで開く */}
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="公開サイトを新しいタブで開く"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
            >
              公開サイトを見る
              <span className="ml-1 text-xs">

              </span>
            </Link>

            <LogoutButton />
          </div>
        </div>

        <p className="mt-6 text-slate-600">
          管理者としてログインしています。
        </p>

        {profile && (
          <ProfileImageForm
            profileId={profile.id}
            hasImage={Boolean(
              profile.imageMimeType,
            )}
          />
        )}

        {/* プロフィール編集 */}
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
                  defaultValue={
                    profile.nameJa ?? ""
                  }
                  className={inputClassName}
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
                  className={inputClassName}
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
                  className={inputClassName}
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
                  className={inputClassName}
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
                  defaultValue={
                    profile.location ?? ""
                  }
                  className={inputClassName}
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

        {/* 実績編集 */}
        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-semibold text-slate-800">
            実績を編集
          </h2>

          {works.length > 0 ? (
            <div className="mt-6 grid gap-8">
              {works.map((work) => (
                <form
                  key={work.id}
                  action={updateWork}
                  className="grid gap-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-6"
                >
                  <input
                    type="hidden"
                    name="id"
                    value={work.id}
                  />

                  <label className="grid gap-2">
                    <span className="font-medium text-slate-700">
                      タイトル
                    </span>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={work.title}
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="font-medium text-slate-700">
                      説明
                    </span>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      defaultValue={
                        work.description
                      }
                      className={inputClassName}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="font-medium text-slate-700">
                      使用技術
                    </span>
                    <input
                      type="text"
                      name="technologies"
                      required
                      defaultValue={work.technologies.join(
                        ", ",
                      )}
                      className={inputClassName}
                      placeholder="例：Next.js, TypeScript, Express"
                    />
                    <span className="text-sm text-slate-500">
                      複数の技術はカンマで区切ります。
                    </span>
                  </label>

                  <label className="grid gap-2">
                    <span className="font-medium text-slate-700">
                      GitHub URL
                    </span>
                    <input
                      type="url"
                      name="githubUrl"
                      defaultValue={
                        work.githubUrl ?? ""
                      }
                      className={inputClassName}
                      placeholder="https://github.com/..."
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="font-medium text-slate-700">
                      デモURL
                    </span>
                    <input
                      type="url"
                      name="demoUrl"
                      defaultValue={
                        work.demoUrl ?? ""
                      }
                      className={inputClassName}
                      placeholder="https://..."
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
                      defaultValue={
                        work.displayOrder
                      }
                      className={inputClassName}
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-fit rounded-full bg-slate-800 px-7 py-3 font-medium text-white transition hover:bg-slate-600"
                  >
                    実績を更新
                  </button>
                </form>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-slate-600">
              登録済みの実績がありません。
            </p>
          )}
        </section>

        {/* スキル登録 */}
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
                className={inputClassName}
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
                className={inputClassName}
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
                className={inputClassName}
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
                className={inputClassName}
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

        {/* 登録済みスキル */}
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