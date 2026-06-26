import Link from "next/link";

export function Nav() {
  return (
    <nav aria-label="Primary" className="nav">
      <div className="container nav__inner">
        <Link href="/" className="nav__brand" aria-label="LUMINARA home">
          <span className="nav__brand-dot" aria-hidden="true" />
          <span className="nav__brand-text">LUMINARA</span>
        </Link>
        <ul className="nav__links">
          <li><Link href="/skills">Skills</Link></li>
          <li><Link href="/graph">Graph</Link></li>
          <li><Link href="#pillars">Ecosystem</Link></li>
          <li><Link href="#live">Live</Link></li>
          <li><Link href="#manifesto">Manifesto</Link></li>
          <li><Link href="https://github.com/luminara-global" target="_blank" rel="noopener">GitHub ↗</Link></li>
          <li><Link href="#contact" className="btn btn--primary btn--sm">Get in touch</Link></li>
        </ul>
      </div>
      <style>{`
        .nav {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(7, 8, 10, 0.85);
          backdrop-filter: saturate(140%) blur(12px);
          -webkit-backdrop-filter: saturate(140%) blur(12px);
          border-bottom: 1px solid var(--line);
        }
        .nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }
        .nav__brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 2px;
          color: var(--fg);
        }
        .nav__brand:hover { color: var(--fg); }
        .nav__brand-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 12px var(--accent);
        }
        .nav__links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          gap: 28px;
          font-family: var(--font-mono);
          font-size: 13px;
        }
        .nav__links a:not(.btn) {
          color: var(--fg-dim);
        }
        .nav__links a:not(.btn):hover { color: var(--accent); }
        .btn--sm { padding: 7px 14px; font-size: 12px; }
        @media (max-width: 720px) {
          .nav__links { gap: 16px; font-size: 12px; }
          .nav__links li:not(:last-child):not(:nth-last-child(2)) { display: none; }
        }
      `}</style>
    </nav>
  );
}
