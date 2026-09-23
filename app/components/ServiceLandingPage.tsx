type LandingProps = {
  eyebrow: string;
  title: string;
  intro: string;
  ctaHref: string;
  ctaLabel?: string;
  bullets: string[];
  uitleg: string;
};

export default function ServiceLandingPage({
  eyebrow,
  title,
  intro,
  ctaHref,
  ctaLabel = "Prijs berekenen & boeken →",
  bullets,
  uitleg,
}: LandingProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#eaf6ff] to-[#f8fcff] text-[#123c70]">
      <header className="border-b border-[#d7eaf8] bg-white/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="text-[29px] font-extrabold tracking-tight text-[#0d3f79]">
            Shine<span className="text-[#1683f8]">Go</span>
            <span className="ml-1 text-[#1683f8]">✦</span>
          </a>
          <a href="/prijzen" className="text-sm font-bold text-[#315f88]">
            Prijzen
          </a>
        </div>
      </header>

      <section className="px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-[1180px] gap-8 rounded-[32px] border border-white bg-white p-7 shadow-[0_24px_70px_rgba(46,79,119,.14)] sm:p-10 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:p-14">
          <div>
            <div className="inline-flex rounded-full bg-[#e7f4ff] px-4 py-2 text-sm font-extrabold text-[#1678d4]">
              {eyebrow}
            </div>
            <h1 className="mt-5 text-[40px] font-extrabold leading-[1.02] tracking-[-.04em] text-[#112f58] sm:text-[58px]">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#607b98] sm:text-lg sm:leading-8">
              {intro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={ctaHref}
                className="rounded-xl bg-[#1683f8] px-8 py-4 text-center text-base font-extrabold text-white shadow-[0_10px_25px_rgba(22,131,248,.25)] transition hover:bg-[#0874df]"
              >
                {ctaLabel}
              </a>
              <a
                href="/prijzen"
                className="rounded-xl border border-[#78b9ee] bg-white px-8 py-4 text-center text-base font-extrabold text-[#1768b5]"
              >
                Bekijk prijzen
              </a>
            </div>
          </div>

          <aside className="rounded-[28px] border border-[#d5e9f8] bg-gradient-to-br from-[#eef8ff] to-[#dcefff] p-6 sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1683f8]">
              Via ShineGo
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#0b3d75]">
              Duidelijk geregeld
            </h2>
            <div className="mt-6 space-y-3">
              {bullets.map((punt) => (
                <div
                  key={punt}
                  className="flex gap-3 rounded-2xl bg-white/90 px-4 py-3 text-sm font-bold text-[#315f88] shadow-sm"
                >
                  <span className="text-[#1683f8]">✓</span>
                  <span>{punt}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-[900px] rounded-[28px] border border-[#d5e9f8] bg-white p-7 shadow-[0_12px_34px_rgba(46,79,119,.08)] sm:p-9">
          <h2 className="text-2xl font-extrabold text-[#0b3d75]">
            Zo werkt glazenwassen via ShineGo
          </h2>
          <p className="mt-4 text-sm leading-7 text-[#6685a1] sm:text-base">
            {uitleg}
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f3f9ff] p-5">
              <strong className="text-[#123c70]">1. Kies de opdracht</strong>
              <p className="mt-2 text-sm leading-6 text-[#6685a1]">
                Geef aan wat voor pand het is en welke ramen je wilt laten wassen.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f3f9ff] p-5">
              <strong className="text-[#123c70]">2. Bekijk de prijs</strong>
              <p className="mt-2 text-sm leading-6 text-[#6685a1]">
                Je ziet vooraf hoe de boekingsprijs wordt opgebouwd.
              </p>
            </div>
            <div className="rounded-2xl bg-[#f3f9ff] p-5">
              <strong className="text-[#123c70]">3. Plan je afspraak</strong>
              <p className="mt-2 text-sm leading-6 text-[#6685a1]">
                Kies een datum en rond je boeking veilig online af.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
