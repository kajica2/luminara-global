import type { Metadata } from "next";
import { EcosystemGraph } from "@/components/EcosystemGraph";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ecosystem graph",
  description:
    "LUMINARA ecosystem map. The 3 pillars — Agent OS, Sigil Engine, Multimedia — and the tools wired to each, drawn as a force-directed graph.",
};

export default function GraphPage() {
  return (
    <>
      <header className="page-header">
        <div className="container">
          <p className="eyebrow">Ecosystem map</p>
          <h1>How the pieces connect.</h1>
          <p className="page-header__lede">
            LUMINARA is a stack, not a monolith. Drag any node to reposition;
            click to highlight its connections. Switch layouts to see the
            same ecosystem from different angles.
          </p>
          <div className="page-header__cta">
            <Link href="/" className="btn btn--ghost">← back home</Link>
            <Link href="/skills" className="btn btn--ghost">per-skill offer</Link>
          </div>
        </div>
      </header>

      <section className="section section--first">
        <div className="container">
          <EcosystemGraph />

          <div className="graph-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#fbbf24" }} />
              <span><strong>core</strong> — the LUMINARA runtime</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#22d3ee" }} />
              <span><strong>pillar</strong> — first-class product (Agent OS / Sigil / Multimedia)</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: "#a78bfa" }} />
              <span><strong>tool</strong> — a worker / skill wired to a pillar</span>
            </div>
          </div>

          <div className="graph-notes">
            <h2>Reading the graph</h2>
            <p>
              Bright lines are <strong>direct edges</strong>: LUMINARA →
              pillar, pillar → tool. The fainter cross-edges (Kanban → Video,
              Twin → Alphabet, Skills → Image) are the interesting
              <em> ecosystem </em> parts — a tool that helps more than its
              own pillar.
            </p>
            <p>
              <strong>Force layout</strong> is the default — nodes breathe
              until they find a balance between repulsion and spring
              tension. <strong>Hierarchical</strong> locks the core to the
              center. <strong>Circular</strong> and <strong>grid</strong> are
              for screenshots when you need a clean composition.
            </p>
            <p className="dim" style={{ fontSize: 11, marginTop: 24 }}>
              Physics: Coulomb repulsion + Hooke springs + centering force,
              semi-implicit Euler with damping. ~150 lines of vanilla React.
              No external graph library.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .page-header__lede {
          font-size: 17px;
          color: var(--fg-dim);
          max-width: 60ch;
          margin-bottom: 24px;
        }
        .page-header__cta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .graph-legend {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 20px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--fg-dim);
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .legend-dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .graph-notes {
          max-width: 720px;
          margin: 56px auto 0;
          font-size: 15px;
          line-height: 1.7;
        }
        .graph-notes h2 {
          font-size: 20px;
          margin-bottom: 16px;
          color: var(--fg);
        }
        .graph-notes p { color: var(--fg-dim); margin: 0 0 16px; }
        .graph-notes strong { color: var(--fg); }
      `}</style>
    </>
  );
}
