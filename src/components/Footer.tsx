import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="nav__brand-dot" aria-hidden="true" />
          <span className="footer__name">LUMINARA</span>
          <span className="footer__sep">·</span>
          <span className="footer__tag">local-first AI ecosystem</span>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <Link href="#pillars">Ecosystem</Link>
          <Link href="#live">Live</Link>
          <Link href="#manifesto">Manifesto</Link>
          <Link href="#contact">Contact</Link>
          <Link href="https://github.com/luminara-global" target="_blank" rel="noopener">
            GitHub ↗
          </Link>
        </nav>
        <p className="footer__legal">
          © {year} LUMINARA · Built with Next.js · Hosted on Vercel
        </p>
      </div>

      <style>{`
        .footer {
          border-top: 1px solid var(--line);
          background: var(--bg-elev);
          padding: 40px 0 32px;
          margin-top: 64px;
        }
        .footer__inner {
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
          text-align: center;
        }
        .footer__brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--fg-dim);
        }
        .footer__name {
          color: var(--fg);
          font-weight: 600;
          letter-spacing: 2px;
        }
        .footer__sep { color: var(--fg-faint); }
        .footer__tag { color: var(--fg-faint); }
        .footer__links {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 12px;
        }
        .footer__links a { color: var(--fg-dim); }
        .footer__links a:hover { color: var(--accent); }
        .footer__legal {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--fg-faint);
          margin: 0;
        }
      `}</style>
    </footer>
  );
}
