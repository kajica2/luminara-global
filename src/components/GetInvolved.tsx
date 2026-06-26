import Link from "next/link";

export function GetInvolved() {
  return (
    <section id="contact" className="section section--last" aria-labelledby="contact-title">
      <div className="container">
        <p className="eyebrow">Get in touch</p>
        <h2 id="contact-title">Build with us.</h2>
        <p className="section__lede">
          LUMINARA is open source and built in public. The fastest way in is
          to ship a PR, file an issue, or open a discussion. For everything
          else:
        </p>

        <div className="grid grid--3 contact__grid">
          <article className="card">
            <p className="card-meta" style={{ color: "var(--accent)" }}>Code</p>
            <h3>GitHub</h3>
            <p>
              Source, issues, releases, and roadmap across the three pillars.
              PRs welcome.
            </p>
            <a href="https://github.com/luminara-global" target="_blank" rel="noopener" className="btn btn--ghost">
              github.com/luminara-global ↗
            </a>
          </article>

          <article className="card">
            <p className="card-meta" style={{ color: "var(--accent-2)" }}>Operator</p>
            <h3>Agent OS</h3>
            <p>
              The orchestration layer. Run <code>hermes agent-os --init</code>
              to scaffold a local workspace in under a minute.
            </p>
            <a href="https://github.com/luminara-global/agent-os" target="_blank" rel="noopener" className="btn btn--ghost">
              Get the operator ↗
            </a>
          </article>

          <article className="card">
            <p className="card-meta" style={{ color: "var(--gold)" }}>Offer</p>
            <h3>Per-skill pricing</h3>
            <p>
              {`>`}0 Hermes skills, one transparent price each. Pick the ones
              you want; skip the rest. No seat fees, no platform tax.
            </p>
            <Link href="/skills" className="btn btn--ghost">
              Browse the catalogue ↗
            </Link>
          </article>

          <article className="card">
            <p className="card-meta" style={{ color: "var(--gold)" }}>Reach</p>
            <h3>Contact</h3>
            <p>
              Partnerships, press, hiring: <code>hi@luminara.global</code>.
              Replies usually within 48 hours.
            </p>
            <a href="mailto:hi@luminara.global" className="btn btn--ghost">
              hi@luminara.global ↗
            </a>
          </article>
        </div>
      </div>

      <style>{`
        .contact__grid { margin-top: 16px; }
        .contact__grid .card { display: flex; flex-direction: column; }
        .contact__grid .btn { margin-top: auto; align-self: flex-start; }
        .section--last { padding-bottom: 120px; }
      `}</style>
    </section>
  );
}
