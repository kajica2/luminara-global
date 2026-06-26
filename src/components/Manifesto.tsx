export function Manifesto() {
  return (
    <section id="manifesto" className="section" aria-labelledby="manifesto-title">
      <div className="container manifesto">
        <p className="eyebrow">Manifesto</p>
        <h2 id="manifesto-title">Five commitments, written down.</h2>

        <ol className="manifesto__list">
          <li>
            <h3>1. Local-first by default.</h3>
            <p>
              Your data, your models, your bills. The default deployment
              target is your laptop. Cloud is an option, not a tax.
            </p>
          </li>
          <li>
            <h3>2. No lock-in.</h3>
            <p>
              Everything is plain files on disk — markdown, SQLite, JSON,
              tarballs. Walk away with the artifacts and you can rebuild
              elsewhere in an afternoon.
            </p>
          </li>
          <li>
            <h3>3. The unit of leverage is the system.</h3>
            <p>
              A good harness around a small model ships more than a great
              model with no harness. We build the system.
            </p>
          </li>
          <li>
            <h3>4. Show your work.</h3>
            <p>
              Every output is reproducible from a single command. Every
              decision has a commit, an issue, or a doc.
            </p>
          </li>
          <li>
            <h3>5. Ship.</h3>
            <p>
              A deployed artifact beats a perfect spec. We cut scope to ship
              Friday, then iterate. Production-grade means it&apos;s running
              for someone, not that it&apos;s complete.
            </p>
          </li>
        </ol>
      </div>

      <style>{`
        .manifesto__list {
          list-style: none;
          padding: 0;
          margin: 32px 0 0;
          counter-reset: manifesto;
          display: grid;
          gap: 20px;
        }
        .manifesto__list li {
          background: var(--bg-elev);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 24px 28px;
          position: relative;
        }
        .manifesto__list h3 {
          font-size: 18px;
          color: var(--accent);
          margin-bottom: 6px;
        }
        .manifesto__list p {
          margin: 0;
          color: var(--fg-dim);
          max-width: none;
        }
      `}</style>
    </section>
  );
}
