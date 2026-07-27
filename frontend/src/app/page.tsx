import { getPortfolioContent } from "@/lib/portfolio-api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { profile, works, skills } = await getPortfolioContent();

  return (
    <main className="watercolor-bg min-h-screen text-[#4a4a4a]">
      {/* ヘッダー */}
      <header className="sticky top-0 z-20 border-b border-white/30 bg-white/45 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="text-xl font-semibold tracking-wide">
            AKIKO PORTFOLIO
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#profile"
              className="text-center transition hover:opacity-60"
            >
              <span className="block text-sm font-semibold">
                私について
              </span>
              <span className="block text-xs">Profile</span>
            </a>

            <a
              href="#works"
              className="text-center transition hover:opacity-60"
            >
              <span className="block text-sm font-semibold">
                制作実績
              </span>
              <span className="block text-xs">Works</span>
            </a>

            <a
              href="#skills"
              className="text-center transition hover:opacity-60"
            >
              <span className="block text-sm font-semibold">
                スキル
              </span>
              <span className="block text-xs">Skills</span>
            </a>

            <a
              href="#contact"
              className="text-center transition hover:opacity-60"
            >
              <span className="block text-sm font-semibold">
                お問い合わせ
              </span>
              <span className="block text-xs">Contact</span>
            </a>
          </nav>
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

          <h2 className="mb-10 text-3xl font-bold leading-relaxed md:text-4xl">
            {profile?.headline ??
              "人に寄り添う経験をデジタルの力へ"}
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
          <div className="flex h-[420px] w-[310px] items-center justify-center rounded-[50%] bg-white/40 shadow-xl ring-1 ring-white/40 md:h-[500px] md:w-[370px]">
            <div className="text-center">
              <p className="text-6xl font-semibold tracking-wider">
                AF
              </p>
              <p className="mt-4 text-sm">プロフィール画像</p>
            </div>
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

        <div className="space-y-8">
          {/* DBから取得するプロフィール本文 */}
          <div className="mx-auto max-w-3xl rounded-2xl bg-white/40 p-8 shadow-sm">
            <p className="leading-8">
              {profile?.bio ??
                "プロフィールを準備しています。"}
            </p>

            {profile?.location && (
              <p className="mt-5 text-sm text-slate-600">
                Location: {profile.location}
              </p>
            )}
          </div>

          {/* 固定表示するキャリア */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "過去",
                text: "旅行、行政、農業、相談支援など、さまざまな仕事を経験しました。",
              },
              {
                title: "現在",
                text: "子育て世代を支える仕事に携わりながら、より良い仕組みづくりを目指してWeb開発を学んでいます。",
              },
              {
                title: "未来",
                text: "人を支える経験とITを組み合わせ、業務改善に関わることを目指しています。",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl bg-white/40 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white/60"
              >
                <h3 className="mb-4 text-center text-2xl font-semibold">
                  {item.title}
                </h3>

                <p className="leading-7">{item.text}</p>
              </article>
            ))}
          </div>
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
          <h2 className="mt-3 text-3xl font-bold">実績</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {works.map((work) => (
            <article
              key={work.id}
              className="rounded-2xl bg-white/40 p-8 shadow-sm transition hover:-translate-y-1 hover:bg-white/60"
            >
              <div className="mb-6 flex h-48 items-center justify-center rounded-xl bg-white/30">
                <span className="text-sm">作品画像</span>
              </div>

              <h3 className="mb-3 text-2xl font-semibold">
                {work.title}
              </h3>

              <p className="mb-5 leading-7">
                {work.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {work.technologies.map((technology) => (
                  <span
                    key={technology}
                    className="rounded-full bg-white/50 px-3 py-1 text-sm"
                  >
                    {technology}
                  </span>
                ))}
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
          <h2 className="mt-3 text-3xl font-bold">スキル</h2>
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

          <button
            type="button"
            className="mt-8 rounded-full bg-white/65 px-8 py-3 text-[#4a4a4a] shadow-sm ring-1 ring-white/60 transition hover:-translate-y-1 hover:bg-white/85"
          >
            Contact me
          </button>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-white/20 py-8 text-center text-sm">
        <p>© 2026 Akiko Fujikawa</p>
      </footer>
    </main>
  );
}