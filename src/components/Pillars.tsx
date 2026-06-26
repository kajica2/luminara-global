import Link from "next/link";

type Pillar = {
  id: string;
  meta: string;
  title: string;
  description: string;
  features: string[];
  href: string;
  accent: string;
};

const PILLARS: Pillar[] = [
  {
    id: "agent-os",
    meta: "Agent OS",
    title: "A local runtime for multi-agent work.",
    description:
      "Hermes Agent OS is a SQLite-backed task board, a FastAPI dashboard, and a CLI — wired together so agents don't need a human babysitter. Phase 1 ships; Phases 2–6 are scoped.",
    features: [
      "9-agent Julian-Goldie stack (Phase 1.5 live)",
      "Hermes Kanban + Cognitive Twin + Multimedia",
      "Hermes, Ollama, Docker-sandbox compatible",
    ],
    href: "https://github.com/luminara-global/agent-os",
    accent: "var(--accent)",
  },
  {
    id: "sigil-engine",
    meta: "Sigil Engine",
    title: "Symbolic interfaces, generated.",
    description:
      "22-letter Alphabet of Desire, Three.js shaders, and a fullscreen keyboard-driven canvas. Sigil Engine turns intent into a generated, visual artifact in under 30 seconds.",
    features: [
      "22-glyph alphabet, fully procedural",
      "Three.js / WebGL composition pipeline",
      "Audio-visual generation panel",
    ],
    href: "https://github.com/luminara-global/sigil-engine",
    accent: "var(--accent-2)",
  },
  {
    id: "multimedia",
    meta: "Multimedia",
    title: "Image, video, and copy in one CLI.",
    description:
      "Image generation, ffmpeg-based video, blog/landing drafts, and social media packs — produced by 7 multimedia workers dispatched through the same orchestrator.",
    features: [
      "FAL-backed image generation",
      "ffmpeg slideshow + (optional) Remotion render",
      "Tarball deploy with Vercel/Netlify instructions",
    ],
    href: "https://github.com/luminara-global/multimedia",
    accent: "var(--gold)",
  },
];

export function Pillars() {
  return (
    <section id="pillars" className="section" aria-labelledby="pillars-title">
      <div className="container">
        <p className="eyebrow">Ecosystem</p>
        <h2 id="pillars-title">Three products, one runtime.</h2>
        <p className="section__lede">
          Each pillar stands alone. Together they share a state model,
          a memory layer, and a deploy story. Pull what you need.
        </p>

        <div className="grid grid--3 pillars__grid">
          {PILLARS.map((p) => (
            <article key={p.id} className="card pillar" id={p.id}>
              <p className="card-meta" style={{ color: p.accent }}>{p.meta}</p>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <ul className="pillar__features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <Link href={p.href} target="_blank" rel="noopener" className="pillar__link">
                View source ↗
              </Link>
              <Link href="/graph" className="pillar__link" style={{ marginLeft: 12, color: "var(--accent-2)" }}>
                See in graph map →
              </Link>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .section__lede {
          font-size: 17px;
          color: var(--fg-dim);
          max-width: 60ch;
          margin-bottom: 48px;
        }
        .pillars__grid { margin-top: 16px; }
        .pillar { display: flex; flex-direction: column; height: 100%; }
        .pillar h3 { margin-top: 4px; }
        .pillar__features {
          list-style: none;
          padding: 0;
          margin: 16px 0 20px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--fg-dim);
        }
        .pillar__features li {
          padding: 4px 0;
          padding-left: 18px;
          position: relative;
        }
        .pillar__features li::before {
          content: '→';
          position: absolute;
          left: 0;
          color: var(--accent);
        }
        .pillar__link {
          font-family: var(--font-mono);
          font-size: 12px;
          margin-top: auto;
          align-self: flex-start;
        }
      `}</style>
    </section>
  );
}
