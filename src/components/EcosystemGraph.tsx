"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * EcosystemGraph — hand-rolled force-directed graph for the LUMINARA
 * ecosystem map. No external deps (no d3).
 *
 * Physics:
 *   - Coulomb repulsion between every pair of nodes (O(n²) per tick)
 *   - Hooke spring on each edge (rest length depends on edge weight)
 *   - Centering force to keep the cluster on screen
 *   - Velocity-Verlet integration with damping
 *
 * Interaction:
 *   - Drag any node
 *   - Click a node to "pin" it (others continue moving)
 *   - "Layout" selector: force | hierarchical | circular | grid
 *   - "Shuffle" to randomize initial positions
 */

type Node = {
  id: string;
  label: string;
  sub?: string;
  group: "core" | "pillar" | "tool";
  x: number;
  y: number;
  vx: number;
  vy: number;
  pinned?: boolean;
  mass?: number;
};

type Edge = {
  source: string;
  target: string;
  weight?: number;
};

type Layout = "force" | "hierarchical" | "circular" | "grid";

const NODES: Node[] = [
  { id: "luminara",   label: "LUMINARA",      sub: "ecosystem root",  group: "core",   x: 0, y: 0, vx: 0, vy: 0, mass: 4 },
  { id: "agent-os",   label: "Agent OS",      sub: "orchestration",   group: "pillar", x: 0, y: 0, vx: 0, vy: 0, mass: 2 },
  { id: "sigil",      label: "Sigil Engine",  sub: "symbolic UI",     group: "pillar", x: 0, y: 0, vx: 0, vy: 0, mass: 2 },
  { id: "multimedia", label: "Multimedia",    sub: "image · video",   group: "pillar", x: 0, y: 0, vx: 0, vy: 0, mass: 2 },
  // tools under agent-os
  { id: "kanban",     label: "Kanban",        sub: "SQLite board",     group: "tool",   x: 0, y: 0, vx: 0, vy: 0 },
  { id: "twin",       label: "Twin",          sub: "thinking partner", group: "tool",   x: 0, y: 0, vx: 0, vy: 0 },
  { id: "skills",     label: "Skills",        sub: "120 catalogued",   group: "tool",   x: 0, y: 0, vx: 0, vy: 0 },
  // tools under sigil
  { id: "alphabet",   label: "Alphabet",      sub: "22 glyphs",        group: "tool",   x: 0, y: 0, vx: 0, vy: 0 },
  { id: "canvas",     label: "Canvas",        sub: "Three.js / WebGL", group: "tool",   x: 0, y: 0, vx: 0, vy: 0 },
  // tools under multimedia
  { id: "image",      label: "Image Gen",     sub: "FAL · PIL fallback", group: "tool", x: 0, y: 0, vx: 0, vy: 0 },
  { id: "video",      label: "Video",         sub: "ffmpeg · Remotion", group: "tool",  x: 0, y: 0, vx: 0, vy: 0 },
  { id: "bundle",     label: "Bundle",        sub: "tar.gz deploy",     group: "tool",  x: 0, y: 0, vx: 0, vy: 0 },
];

const EDGES: Edge[] = [
  // core to pillars
  { source: "luminara",   target: "agent-os",   weight: 3 },
  { source: "luminara",   target: "sigil",      weight: 3 },
  { source: "luminara",   target: "multimedia", weight: 3 },
  // pillars to tools
  { source: "agent-os",   target: "kanban",     weight: 2 },
  { source: "agent-os",   target: "twin",       weight: 2 },
  { source: "agent-os",   target: "skills",     weight: 1 },
  { source: "sigil",      target: "alphabet",   weight: 2 },
  { source: "sigil",      target: "canvas",     weight: 2 },
  { source: "multimedia", target: "image",      weight: 2 },
  { source: "multimedia", target: "video",      weight: 2 },
  { source: "multimedia", target: "bundle",     weight: 1 },
  // cross-pillar bridges (the interesting "ecosystem" part)
  { source: "kanban",     target: "video",      weight: 1 },
  { source: "twin",       target: "alphabet",   weight: 1 },
  { source: "skills",     target: "image",      weight: 1 },
  { source: "bundle",     target: "twin",       weight: 1 },
];

const W = 920;
const H = 600;
const REST = 120;     // base rest length for an edge
const K = 0.018;      // spring stiffness
const REPULSION = 6000; // Coulomb constant
const DAMPING = 0.84;
const CENTER_STRENGTH = 0.012;

// Seed positions for non-force layouts.
function seedLayout(layout: Layout, nodes: Node[]) {
  if (layout === "force") {
    nodes.forEach(n => {
      n.x = (Math.random() - 0.5) * W * 0.6;
      n.y = (Math.random() - 0.5) * H * 0.6;
      n.vx = 0; n.vy = 0;
    });
    return;
  }
  if (layout === "circular") {
    nodes.forEach((n, i) => {
      const a = (i / nodes.length) * Math.PI * 2;
      n.x = Math.cos(a) * (W * 0.32);
      n.y = Math.sin(a) * (H * 0.32);
      n.vx = 0; n.vy = 0;
    });
    return;
  }
  if (layout === "grid") {
    const cols = 4;
    nodes.forEach((n, i) => {
      n.x = ((i % cols) - (cols - 1) / 2) * (W * 0.22);
      n.y = (Math.floor(i / cols) - Math.floor(nodes.length / cols) / 2) * (H * 0.20);
      n.vx = 0; n.vy = 0;
    });
    return;
  }
  // hierarchical: core center, pillars mid-ring, tools outer
  const core = nodes.find(n => n.group === "core")!;
  core.x = 0; core.y = 0;
  const pillars = nodes.filter(n => n.group === "pillar");
  const tools = nodes.filter(n => n.group === "tool");
  pillars.forEach((p, i) => {
    const a = (i / pillars.length) * Math.PI * 2 - Math.PI / 2;
    p.x = Math.cos(a) * 180;
    p.y = Math.sin(a) * 130;
    p.vx = 0; p.vy = 0;
  });
  // tools: position near their parent pillar
  tools.forEach((t) => {
    const parent = EDGES.find(e => e.source === "agent-os" || e.source === "sigil" || e.source === "multimedia")
      ? null : null;
    // Map tool id to pillar
    const pillarMap: Record<string, string> = {
      kanban: "agent-os", twin: "agent-os", skills: "agent-os",
      alphabet: "sigil", canvas: "sigil",
      image: "multimedia", video: "multimedia", bundle: "multimedia",
    };
    const parentId = pillarMap[t.id] || "luminara";
    const parentNode = nodes.find(n => n.id === parentId)!;
    const idx = tools.indexOf(t);
    const a = (idx / tools.length) * Math.PI * 2;
    t.x = parentNode.x + Math.cos(a) * 240;
    t.y = parentNode.y + Math.sin(a) * 160;
    t.vx = 0; t.vy = 0;
  });
}

// One physics tick. O(n²) for repulsion + O(e) for springs.
function physicsTick(nodes: Node[], edges: Edge[]) {
  // 1) Repulsion (Coulomb)
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const d2 = dx * dx + dy * dy + 0.01;
      const d = Math.sqrt(d2);
      const f = REPULSION / d2;
      const fx = (dx / d) * f;
      const fy = (dy / d) * f;
      const ma = a.mass ?? 1, mb = b.mass ?? 1;
      a.vx -= fx / ma; a.vy -= fy / ma;
      b.vx += fx / mb; b.vy += fy / mb;
    }
  }
  // 2) Springs
  for (const e of edges) {
    const a = nodes.find(n => n.id === e.source);
    const b = nodes.find(n => n.id === e.target);
    if (!a || !b) continue;
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
    const target = REST * (1 / ((e.weight ?? 1) * 0.6 + 0.4));
    const force = K * (d - target);
    const fx = (dx / d) * force;
    const fy = (dy / d) * force;
    const ma = a.mass ?? 1, mb = b.mass ?? 1;
    a.vx += fx / ma; a.vy += fy / ma;
    b.vx -= fx / mb; b.vy -= fy / mb;
  }
  // 3) Centering
  for (const n of nodes) {
    n.vx += -n.x * CENTER_STRENGTH;
    n.vy += -n.y * CENTER_STRENGTH;
  }
  // 4) Integrate (semi-implicit Euler with damping)
  for (const n of nodes) {
    if (n.pinned) { n.vx = 0; n.vy = 0; continue; }
    n.vx *= DAMPING;
    n.vy *= DAMPING;
    n.x += n.vx;
    n.y += n.vy;
    // Soft bounds
    const maxX = W * 0.45, maxY = H * 0.42;
    if (n.x > maxX) { n.x = maxX; n.vx *= -0.5; }
    if (n.x < -maxX) { n.x = -maxX; n.vx *= -0.5; }
    if (n.y > maxY) { n.y = maxY; n.vy *= -0.5; }
    if (n.y < -maxY) { n.y = -maxY; n.vy *= -0.5; }
  }
}

const GROUP_COLOR: Record<Node["group"], string> = {
  core:   "#fbbf24", // gold
  pillar: "#22d3ee", // cyan
  tool:   "#a78bfa", // violet
};

export function EcosystemGraph() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const nodesRef = useRef<Node[]>(NODES.map(n => ({ ...n })));
  const edgesRef = useRef<Edge[]>(EDGES);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const [layout, setLayout] = useState<Layout>("force");
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [, force] = useState(0); // re-render trigger

  // (Re)seed on layout change
  useEffect(() => {
    seedLayout(layout, nodesRef.current);
    force(x => x + 1);
  }, [layout]);

  // Run physics loop
  useEffect(() => {
    function tick() {
      if (layout === "force") {
        for (let i = 0; i < 2; i++) physicsTick(nodesRef.current, edgesRef.current);
      } else {
        // gentle settling for non-force layouts
        physicsTick(nodesRef.current, edgesRef.current);
      }
      force(x => x + 1);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [layout]);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGGElement>, id: string) => {
    const node = nodesRef.current.find(n => n.id === id);
    if (!node) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    node.pinned = true;
    dragRef.current = {
      id,
      dx: e.clientX - (W / 2 + node.x),
      dy: e.clientY - (H / 2 + node.y),
    };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGGElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const node = nodesRef.current.find(n => n.id === d.id);
    if (!node) return;
    node.x = e.clientX - W / 2 - d.dx;
    node.y = e.clientY - H / 2 - d.dy;
    node.vx = 0; node.vy = 0;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<SVGGElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const node = nodesRef.current.find(n => n.id === d.id);
    if (node) node.pinned = false;
    dragRef.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }, []);

  const onNodeClick = useCallback((id: string) => {
    setSelected(prev => prev === id ? null : id);
  }, []);

  const shuffle = useCallback(() => {
    nodesRef.current.forEach(n => {
      n.x = (Math.random() - 0.5) * W * 0.6;
      n.y = (Math.random() - 0.5) * H * 0.6;
      n.vx = 0; n.vy = 0;
    });
    force(x => x + 1);
  }, []);

  // Build edge paths
  const nodes = nodesRef.current;
  const edges = edgesRef.current;
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  // Adjacency for highlighting
  const adjacent = new Set<string>();
  if (selected) {
    adjacent.add(selected);
    for (const e of edges) {
      if (e.source === selected) adjacent.add(e.target);
      if (e.target === selected) adjacent.add(e.source);
    }
  }
  if (hovered) {
    for (const e of edges) {
      if (e.source === hovered) { adjacent.add(e.target); adjacent.add(hovered); }
      if (e.target === hovered) { adjacent.add(e.source); adjacent.add(hovered); }
    }
  }

  return (
    <div className="ecosystem-graph">
      <div className="graph-toolbar">
        <span className="dim" style={{ fontSize: 11, marginRight: "auto" }}>layout:</span>
        {(["force", "hierarchical", "circular", "grid"] as Layout[]).map(l => (
          <button
            key={l}
            type="button"
            className={`role-filter ${layout === l ? "active" : ""}`}
            data-layout={l}
            onClick={() => setLayout(l)}
          >
            {l}
          </button>
        ))}
        <button type="button" className="action" onClick={shuffle} style={{ marginLeft: 8 }}>↻ shuffle</button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`${-W / 2} ${-H / 2} ${W} ${H}`}
        width="100%"
        height="100%"
        role="img"
        aria-label="LUMINARA ecosystem graph"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: "none", userSelect: "none" }}
      >
        {/* edges */}
        {edges.map((e, i) => {
          const a = nodeMap[e.source];
          const b = nodeMap[e.target];
          if (!a || !b) return null;
          const dim = selected && !(adjacent.has(e.source) && adjacent.has(e.target));
          const active = selected && adjacent.has(e.source) && adjacent.has(e.target);
          return (
            <line
              key={i}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={active ? "#22d3ee" : "#6b6b6b"}
              strokeWidth={(e.weight ?? 1) * (active ? 1.6 : 0.8)}
              strokeOpacity={dim ? 0.12 : active ? 0.95 : 0.5}
            />
          );
        })}

        {/* nodes */}
        {nodes.map(n => {
          const isSelected = selected === n.id;
          const isHovered = hovered === n.id;
          const isAdjacent = adjacent.has(n.id);
          const r = n.group === "core" ? 36 : n.group === "pillar" ? 26 : 18;
          const dim = (selected || hovered) && !isAdjacent;
          return (
            <g
              key={n.id}
              data-node={n.id}
              transform={`translate(${n.x}, ${n.y})`}
              style={{ cursor: n.pinned ? "grabbing" : "grab" }}
              onPointerDown={(e) => onPointerDown(e, n.id)}
              onClick={(e) => { e.stopPropagation(); onNodeClick(n.id); }}
              onMouseEnter={() => setHovered(n.id)}
              onMouseLeave={() => setHovered(h => h === n.id ? null : h)}
              opacity={dim ? 0.25 : 1}
            >
              <circle
                r={r + (isSelected || isHovered ? 4 : 0)}
                fill={GROUP_COLOR[n.group]}
                stroke={isSelected ? "#fff" : isHovered ? "#fff" : "transparent"}
                strokeWidth={isSelected || isHovered ? 2 : 0}
                style={{ transition: "all 120ms ease" }}
              />
              <text
                y={r + 14}
                textAnchor="middle"
                fontFamily="ui-monospace, SF Mono, Menlo, monospace"
                fontSize={n.group === "core" ? 13 : 11}
                fontWeight={n.group === "core" ? 700 : 500}
                fill="#e6e6e6"
                style={{ pointerEvents: "none" }}
              >
                {n.label}
              </text>
              {n.sub && (
                <text
                  y={r + 28}
                  textAnchor="middle"
                  fontFamily="ui-monospace, SF Mono, Menlo, monospace"
                  fontSize={9}
                  fill="#71717a"
                  style={{ pointerEvents: "none" }}
                >
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {selected && (
        <div className="graph-info">
          <h3>{nodeMap[selected]?.label}</h3>
          <p>{nodeMap[selected]?.sub}</p>
          <p style={{ color: "var(--dim)", fontSize: 11, margin: "8px 0 0" }}>
            {edges.filter(e => e.source === selected || e.target === selected).length} connection(s) ·
            {" "}group: {nodeMap[selected]?.group}
          </p>
          <button type="button" className="action" style={{ marginTop: 12 }} onClick={() => setSelected(null)}>
            close
          </button>
        </div>
      )}

      <style>{`
        .ecosystem-graph {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 480px;
          background: var(--bg-elev);
          border: 1px solid var(--line);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .graph-toolbar {
          position: absolute;
          top: 12px; left: 12px;
          display: flex; gap: 6px;
          z-index: 5;
          background: rgba(7, 8, 10, 0.7);
          padding: 6px;
          border-radius: var(--radius);
          backdrop-filter: blur(8px);
        }
        .graph-info {
          position: absolute;
          bottom: 12px; right: 12px;
          width: 280px;
          background: var(--bg-elev);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 16px;
          backdrop-filter: blur(8px);
        }
        .graph-info h3 { margin: 0 0 4px; font-size: 14px; color: var(--fg); }
        .graph-info p { margin: 0; font-size: 12px; color: var(--fg-dim); }
      `}</style>
    </div>
  );
}
