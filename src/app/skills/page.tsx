import type { Metadata } from "next";
import Link from "next/link";
import { SKILLS, categories, countByCategory } from "@/data/skills";

export const metadata: Metadata = {
  title: "Skills · per-skill offer",
  description:
    "LUMINARA offers per-skill pricing across the Hermes ecosystem. Pick the skills you want, pay only for those.",
};

type SearchParams = { q?: string; cat?: string; tier?: string; sort?: string };

export default async function SkillsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").toLowerCase().trim();
  const cat = params.cat ?? "";
  const tier = params.tier ?? "";
  const sort = params.sort ?? "category";

  const cats = categories();
  const counts = countByCategory();
  const totalSkills = SKILLS.length;

  let rows = SKILLS.filter(s => {
    if (cat && s.category !== cat) return false;
    if (tier && (s.offer.tier ?? "standard") !== tier) return false;
    if (q && !(`${s.name} ${s.description} ${s.category}`.toLowerCase().includes(q))) return false;
    return true;
  });

  if (sort === "price-asc") {
    rows.sort((a, b) => (a.offer.priceUsd ?? Infinity) - (b.offer.priceUsd ?? Infinity));
  } else if (sort === "price-desc") {
    rows.sort((a, b) => (b.offer.priceUsd ?? -1) - (a.offer.priceUsd ?? -1));
  } else if (sort === "name") {
    rows.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // default: by category, then name
    rows.sort((a, b) =>
      a.category === b.category ? a.name.localeCompare(b.name) : a.category.localeCompare(b.category)
    );
  }

  return (
    <>
      <header className="page-header">
        <div className="container">
          <p className="eyebrow">Offer</p>
          <h1>Per-skill pricing, plain.</h1>
          <p className="page-header__lede">
            {totalSkills} Hermes skills. Pick the ones you want, pay only for
            those. No seat fees, no platform tax. Open-source code, hosted if
            you&apos;d rather not run it.
          </p>
          <div className="page-header__cta">
            <Link href="#contact" className="btn btn--primary">Request a quote</Link>
            <Link href="/" className="btn btn--ghost">Back home</Link>
          </div>
        </div>
      </header>

      <section className="section section--first">
        <div className="container">
          <form className="skills-filter" method="get">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="search skills…"
              aria-label="search skills"
            />
            <select name="cat" defaultValue={cat} aria-label="category">
              <option value="">all categories ({totalSkills})</option>
              {cats.map(c => (
                <option key={c} value={c}>
                  {c} ({counts[c] || 0})
                </option>
              ))}
            </select>
            <select name="tier" defaultValue={tier} aria-label="tier">
              <option value="">all tiers</option>
              <option value="standard">standard</option>
              <option value="priority">priority</option>
              <option value="enterprise">enterprise</option>
            </select>
            <select name="sort" defaultValue={sort} aria-label="sort">
              <option value="category">sort: category</option>
              <option value="name">sort: name</option>
              <option value="price-asc">sort: price ↑</option>
              <option value="price-desc">sort: price ↓</option>
            </select>
            <button type="submit" className="btn btn--primary btn--sm">apply</button>
            <Link href="/skills" className="btn btn--ghost btn--sm">reset</Link>
          </form>

          <p className="skills-count">
            showing <strong>{rows.length}</strong> of {totalSkills} skills
            {cat && <> in <code>{cat}</code></>}
            {q && <> matching <code>{q}</code></>}
          </p>

          <div className="skills-grid">
            {rows.map(s => (
              <article key={s.name} className="card skill-card" data-category={s.category}>
                <p className="card-meta">
                  <span className={`tier tier-${s.offer.tier ?? "standard"}`}>
                    {s.offer.tier ?? "standard"}
                  </span>
                  {s.category}
                </p>
                <h3>
                  <code>{s.name}</code>
                </h3>
                <p>{s.description || <em>(no description)</em>}</p>
                <div className="skill-card__offer">
                  <p className="skill-card__price">
                    {s.offer.priceUsd === null ? (
                      <span className="tbd">talk to us</span>
                    ) : s.offer.priceUsd === 0 ? (
                      <span className="free">free</span>
                    ) : (
                      <>
                        <span className="currency">$</span>
                        <span className="amount">{s.offer.priceUsd}</span>
                      </>
                    )}
                  </p>
                  <p className="skill-card__unit">{s.offer.unit}</p>
                  <p className="skill-card__sku">sku: <code>{s.offer.sku}</code></p>
                </div>
              </article>
            ))}
          </div>

          {rows.length === 0 && (
            <p className="empty">
              No skills match those filters. <Link href="/skills">Reset</Link>.
            </p>
          )}
        </div>
      </section>

      <style>{`
        .page-header {
          padding: 96px 0 48px;
          background:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(108, 255, 255, 0.10), transparent 70%);
          border-bottom: 1px solid var(--line);
        }
        .page-header h1 {
          font-family: var(--font-mono);
          font-size: clamp(2.25rem, 4.5vw, 3.5rem);
          margin-bottom: 16px;
        }
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

        .skills-filter {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 16px;
          align-items: center;
        }
        .skills-filter input[type="search"] {
          flex: 1;
          min-width: 200px;
          background: var(--bg-elev);
          color: var(--fg);
          border: 1px solid var(--line);
          padding: 8px 12px;
          border-radius: var(--radius);
          font: inherit;
          font-size: 13px;
        }
        .skills-filter select {
          background: var(--bg-elev);
          color: var(--fg);
          border: 1px solid var(--line);
          padding: 8px 12px;
          border-radius: var(--radius);
          font: inherit;
          font-size: 13px;
        }
        .btn--sm { padding: 6px 12px; font-size: 12px; }

        .skills-count {
          font-size: 12px;
          color: var(--fg-dim);
          margin-bottom: 24px;
          font-family: var(--font-mono);
        }
        .skills-count strong { color: var(--accent); }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .skill-card { display: flex; flex-direction: column; }
        .skill-card h3 {
          font-size: 14px;
          margin: 6px 0 8px;
        }
        .skill-card h3 code {
          font-size: 14px;
          background: transparent;
          border: 0;
          padding: 0;
          color: var(--fg);
        }
        .skill-card p {
          font-size: 12.5px;
          color: var(--fg-dim);
          line-height: 1.55;
        }
        .skill-card .card-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tier {
          font-family: var(--font-mono);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 2px 6px;
          border-radius: 3px;
          border: 1px solid var(--line);
          color: var(--fg-dim);
        }
        .tier-standard { color: var(--accent); border-color: var(--accent); }
        .tier-priority { color: var(--gold); border-color: var(--gold); }
        .tier-enterprise { color: var(--accent-2); border-color: var(--accent-2); }

        .skill-card__offer {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px dashed var(--line);
          font-family: var(--font-mono);
        }
        .skill-card__price {
          font-size: 22px;
          font-weight: 600;
          color: var(--fg);
          margin: 0 0 4px;
        }
        .skill-card__price .currency { color: var(--fg-dim); font-size: 14px; }
        .skill-card__price .amount { color: var(--accent); }
        .skill-card__price .tbd {
          font-size: 13px;
          color: var(--gold);
          font-weight: 500;
        }
        .skill-card__price .free {
          font-size: 16px;
          color: var(--green);
        }
        .skill-card__unit {
          font-size: 11px;
          color: var(--fg-faint);
          margin: 0 0 4px;
        }
        .skill-card__sku {
          font-size: 10px;
          color: var(--fg-faint);
          margin: 0;
        }
        .skill-card__sku code {
          font-size: 10px;
          color: var(--fg-faint);
          background: transparent;
          border: 0;
          padding: 0;
        }

        .empty {
          padding: 60px 0;
          text-align: center;
          color: var(--fg-dim);
        }
      `}</style>
    </>
  );
}
