export default function DetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @media (min-width: 1024px) {
          main > div { max-width: 1040px !important; }
          main section { border-radius: 22px !important; }
          main section > div { grid-template-columns: 1.35fr .65fr !important; }
          main aside { min-height: 690px !important; background: linear-gradient(180deg, rgba(234,246,255,.08), rgba(223,242,255,.30)), url('/booking/hoog.svg') center/cover no-repeat !important; }
          main aside > img { display: none !important; }
        }
      `}</style>
      {children}
    </>
  );
}
