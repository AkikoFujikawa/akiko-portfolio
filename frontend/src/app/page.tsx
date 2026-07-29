import Image from "next/image";
import Link from "next/link";
import { getPortfolioContent } from "@/lib/portfolio-api";
import ContactForm from "./contact-form";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { profile, works, skills } =
    await getPortfolioContent();

  return (
    <main className="watercolor-bg min-h-screen text-[#4a4a4a]">
      {/* ヘッダー */}
      <header className="sticky top-0 z-20 border-b border-white/30 bg-white/45 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <a
            href="#"
            className="text-xl font-semibold tracking-wide"
          >
            AKIKO PORTFOLIO
          </a>

          <nav className="hidden items-center gap-5 md:flex lg:gap-8">
            <a
              href="#profile"
              className="text-center transition hover:opacity-60"
            >
              <span className="block text-sm font-semibold">
                私について
              </span>
              <span className="block text-xs">
                Profile
              </span>
            </a>

            <a
              href="#works"
              className="text-center transition hover:opacity-60"
            >
              <span className="block text-sm font-semibold">
                制作実績
              </span>
              <span className="block text-xs">
                Works
              </span>
            </a>

            <a
              href="#skills"
              className="text-center transition hover:opacity-60"
            >
              <span className="block text-sm font-semibold">
                スキル
              </span>
              <span className="block text-xs">
                Skills
              </span>
            </a>

            <a
              href="#contact"
              className="text-center transition hover:opacity-60"
            >
              <span className="block text-sm font-semibold">
                お問い合わせ
              </span>
              <span className="block text-xs">
                Contact
              </span>
            </a>
          </nav>

          {/* 管理者ログインを別タブで開く */}
          <Link
            href="/admin/login"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="管理者ログインを新しいタブで開く"
            className="whitespace-nowrap rounded-full border border-[#4a4a4a]/20 bg-white/30 px-3 py-2 text-xs text-[#4a4a4a]/70 transition hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
          >
            管理者ログイン
            <span className="ml-1 hidden lg:inline">

            </span>
            <span
              aria-hidden="true"
              className="ml-1 lg:hidden"
            >
              ↗
            </span>
          </Link>
        </div>
      </header>

      {/* トップ画面 */}
      <section className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-12 overflow-hidden px-6 py-20 md:grid-cols-2">
        <div className="absolute left-10 top-24 h-52 w-52 rounded-full bg-pink-100/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-sky-100/25 blur-3xl" />

        {/* 左側 */}
        <div className="fade-up relative z-10">
          <div className="mb-10">
            <p className="text-2xl font-medium tracking-wider">
              {profile?.nameJa ?? "藤川 明子"}
            </p>

            <p className="mt-2 text-xl tracking-[0.12em]">
              {profile?.name ?? "Akiko Fujikawa"}
            </p>
          </div>

          <h1 className="mb-10 text-5xl font-light tracking-[0.18em] md:text-7xl">
            Portfolio
          </h1>

          <h2 className="mb-10 whitespace-pre-line text-3xl font-bold leading-relaxed md:text-4xl">
            {profile?.headline ??
              "人に寄り添う経験を\nデジタルの力へ"}
          </h2>

          <div className="flex flex-wrap gap-4">
            <a
              href="#works"
              className="rounded-full bg-white/65 px-7 py-3 text-[#4a4a4a] shadow-sm ring-1 ring-white/60 transition hover:-translate-y-1 hover:bg-white/85"
            >
              実績を見る
            </a>

            <a
              href="#contact"
              className="rounded-full bg-white/65 px-7 py-3 text-[#4a4a4a] shadow-sm ring-1 ring-white/60 transition hover:-translate-y-1 hover:bg-white/85"
            >
              お問い合わせ
            </a>
          </div>
        </div>

        {/* 右側 */}
        <div className="fade-up relative z-10 flex justify-center">
          <div className="relative flex h-[420px] w-[310px] items-center justify-center overflow-hidden rounded-[50%] bg-white/40 shadow-xl ring-1 ring-white/40 md:h-[500px] md:w-[370px]">
            {profile?.imageMimeType ? (
              <Image
                src="/api/profile-image"
                alt={`${
                  profile.nameJa ?? profile.name
                }のプロフィール画像`}
                fill
                sizes="(min-width: 768px) 370px, 310px"
                priority
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="text-center">
                <p className="text-6xl font-semibold tracking-wider">
                  AF
                </p>
                <p className="mt-4 text-sm">
                  プロフィール画像
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* プロフィール */}
      <section
        id="profile"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20"
      >
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-[0.25em]">
            PROFILE
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            プロフィール
          </h2>
        </div>

        <div className="mx-auto max-w-3xl rounded-2xl bg-white/40 p-8 shadow-sm">
          <p className="whitespace-pre-line leading-8">
            {profile?.bio ??
              "プロフィールを準備しています。"}
          </p>

          {profile?.location && (
            <p className="mt-5 text-sm text-slate-600">
              Location: {profile.location}
            </p>
          )}
        </div>

        {/* 過去・現在・未来 */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl bg-white/40 p-7 shadow-sm">
            <h3 className="text-center text-xl font-semibold">
              過去
            </h3>
            <p className="mt-4 leading-7">
              旅行、行政、農業、相談支援など、
              さまざまな仕事を経験しました。
            </p>
          </article>

          <article className="rounded-2xl bg-white/40 p-7 shadow-sm">
            <h3 className="text-center text-xl font-semibold">
              現在
            </h3>
            <p className="mt-4 leading-7">
              子育て世代を支える仕事に携わりながら、
              より良い仕組みづくりを目指して
              Web開発を学んでいます。
            </p>
          </article>

          <article className="rounded-2xl bg-white/40 p-7 shadow-sm">
            <h3 className="text-center text-xl font-semibold">
              未来
            </h3>
            <p className="mt-4 leading-7">
              人を支える経験とITを組み合わせ、
              業務改善に関わることを目指しています。
            </p>
          </article>
        </div>
      </section>

      {/* 実績 */}
      <section
        id="works"
        className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20"
      >
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-[0.25em]">
            WORKS
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            実績
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {works.map((work) => (
            <article
              key={work.id}
              className="rounded-2xl bg-white/40 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white/60"
            >
              <div className="mb-6 flex h-48 items-center justify-center rounded-xl bg-white/30">
                <span className="text-sm">
                  作品画像
                </span>
              </div>

              <h3 className="mb-3 text-2xl font-semibold">
                {work.title}
              </h3>

              <p className="mb-5 whitespace-pre-line leading-7">
                {work.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {work.technologies.map(
                  (technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-white/50 px-3 py-1 text-sm"
                    >
                      {technology}
                    </span>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* スキル */}
      <section
        id="skills"
        className="mx-auto max-w-4xl scroll-mt-20 px-6 py-20"
      >
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-[0.25em]">
            SKILLS
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            スキル
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill) => (
            <span
              key={skill.id}
              className="rounded-full bg-white/45 px-5 py-3 font-medium shadow-sm"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </section>

      {/* お問い合わせ */}
      <section
        id="contact"
        className="mx-auto max-w-3xl scroll-mt-20 px-6 py-20"
      >
        <div className="rounded-3xl bg-white/40 p-10 text-center shadow-sm">
          <p className="text-sm font-semibold tracking-[0.25em]">
            CONTACT
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            お問い合わせ
          </h2>

          <p className="mt-5 leading-7">
            どんなことでもお気軽にお問い合わせください。
          </p>

          <ContactForm />
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-white/20 py-8 text-center text-sm">
        <p>© 2026 Akiko Fujikawa</p>
      </footer>
    </main>
  );
}