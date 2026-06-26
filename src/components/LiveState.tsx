/**
 * LiveState — server component showing static "what's running" cards.
 * Numbers are real but static at build time. A future iteration will hit
 * /api/agents/state via the Agent OS backend and stream updates.
 */
type LiveItem = {
  label: string;
  value: string;
  note: string;
  status: "ok" | "warn" | "info";
};

const ITEMS: LiveItem[] = [
  {
    label: "Agent OS dashboard",
    value: "127.0.0.1:7788",
    note: "FastAPI · WebSocket · 11 worker kinds",
    status: "info",
  },
  {
    label: "Hermes Kanban boards",
    value: "2 / 2",
    note: "agentos-dev · agentos-components",
    status: "ok",
  },
  {
    label: "Skills catalog",
    value: "120 / 32",
    note: "all 120 catalogued, 32 actionable",
    status: "ok",
  },
  {
    label: "Multimedia pipeline",
    value: "7 / 7",
    note: "research · image · video · blog · landing · social · bundle",
    status: "ok",
  },
];

function StatusDot({ status }: { status: LiveItem["status"] }) {
  const color =
    status === "ok" ? "var(--green)" :
    status === "warn" ? "var(--warn)" :
    "var(--accent)";
  return <span className="live-dot" style={{ background: color, boxShadow: `0 0 8px ${color}` }} aria-hidden="true" />;
}

export function LiveState() {
  return (
    <section id="live" className="section" aria-labelledby="live-title">
      <div className="container">
        <p className="eyebrow">Right now</p>
        <h2 id="live-title">What&apos;s running on this machine.</h2>
        <p className="section__lede">
          The dashboard below is what you see when you open
          <code> ~/agent_os/workspace/agent-os </code> locally. Same data the
          next iteration of this site will stream live.
        </p>

        <div className="grid grid--4 live__grid">
          {ITEMS.map((item) => (
            <article key={item.label} className="card live-card">
              <p className="card-meta">
                <StatusDot status={item.status} /> {item.label}
              </p>
              <p className="live-card__value">{item.value}</p>
              <p className="live-card__note">{item.note}</p>
            </article>
          ))}
        </div>

        <p className="live__footer">
          Want to wire this section to the live Agent OS API?
          Open <code>src/components/LiveState.tsx</code> and swap the static
          <code> ITEMS </code> array for a fetch to
          <code> http://127.0.0.1:7788/api/agents/state</code>.
        </p>
      </div>

      <style>{`
        .live__grid { margin-top: 16px; }
        .live-card .card-meta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .live-card__value {
          font-family: var(--font-mono);
          font-size: 22px;
          font-weight: 600;
          color: var(--fg);
          margin: 8px 0 4px;
        }
        .live-card__note {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--fg-faint);
          margin: 0;
        }
        .live__footer {
          margin-top: 32px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--fg-faint);
        }
      `}</style>
    </section>
  );
}
