import Link from "next/link";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="dot" aria-hidden="true" /> local-first AI ecosystem
          </p>
          <h1 id="hero-title">
            The system around the model.
          </h1>
          <p className="hero__lede">
            LUMINARA is a stack of agents, runtimes, and tools for people who
            ship. Agent OS for orchestration, Sigil Engine for symbolic
            interfaces, Multimedia for generation. Owned by you, runs on your
            machine, deploys when you say so.
          </p>
          <div className="hero__cta">
            <Link href="#pillars" className="btn btn--primary">Explore the stack</Link>
            <Link href="https://github.com/luminara-global" target="_blank" rel="noopener" className="btn btn--ghost">
              Read the source ↗
            </Link>
          </div>
          <p className="hero__sub">
            Open source · Self-hostable · Built on Hermes Agent OS
          </p>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <pre className="terminal"><code>{`$ luminara status

✓ Agent OS          running  pid 88273
✓ Sigil Engine      running  pid 88274
✓ Multimedia        running  pid 88275
✓ Cognitive Twin    online   last seen 2s ago

3/3 services healthy
`}</code></pre>
        </div>
      </div>

      <style>{`
        .hero {
          padding: 96px 0 72px;
          background:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(108, 255, 255, 0.12), transparent 70%),
            radial-gradient(ellipse 60% 40% at 90% 30%, rgba(200, 168, 255, 0.08), transparent 70%);
          position: relative;
          overflow: hidden;
        }
        .hero__inner {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 64px;
          align-items: center;
        }
        .hero h1 {
          font-family: var(--font-mono);
          font-size: clamp(2.5rem, 5.5vw, 4.5rem);
          font-weight: 600;
          background: linear-gradient(180deg, var(--fg) 0%, var(--fg-dim) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .hero__lede {
          font-size: 18px;
          line-height: 1.65;
          color: var(--fg-dim);
          max-width: 56ch;
          margin-bottom: 32px;
        }
        .hero__cta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .hero__sub {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--fg-faint);
          margin: 0;
        }
        .hero__visual {
          display: flex;
          justify-content: center;
        }
        .terminal {
          width: 100%;
          max-width: 460px;
          margin: 0;
          background: var(--bg-elev);
          border: 1px solid var(--line-strong);
          border-radius: var(--radius-lg);
          padding: 20px;
          font-size: 13px;
          line-height: 1.7;
          color: var(--accent);
          box-shadow: var(--shadow-2);
          position: relative;
        }
        .terminal::before {
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--green);
          margin-bottom: 14px;
          box-shadow: 0 0 8px var(--green);
        }
        @media (max-width: 900px) {
          .hero__inner { grid-template-columns: 1fr; gap: 40px; }
          .hero { padding: 64px 0; }
        }
      `}</style>
    </section>
  );
}
