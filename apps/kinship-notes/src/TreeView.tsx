import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Maximize2, Minus, Plus, LocateFixed } from "lucide-react";
import type { Person, Family } from "./gedcom";
import {
  CARD_H,
  CARD_W,
  buildIndex,
  fanSlots,
  horizontalTree,
  hourglass,
  lifespan,
  wholeTree,
  type Bounds,
  type Layout,
} from "./tree";

type Mode = "whole" | "hourglass" | "pedigree" | "descendants" | "fan";
const MODES: { id: Mode; label: string; hint: string }[] = [
  {
    id: "whole",
    label: "Whole tree",
    hint: "Everyone in the file, one row per generation",
  },
  { id: "hourglass", label: "Hourglass", hint: "Ancestors above, descendants below" },
  { id: "pedigree", label: "Pedigree", hint: "Direct ancestors, left to right" },
  {
    id: "descendants",
    label: "Descendants",
    hint: "Children, grandchildren and their partners",
  },
  { id: "fan", label: "Fan", hint: "Ancestors as a radial chart" },
];

const clip = (s: string, n: number) =>
  s.length > n ? `${s.slice(0, Math.max(1, n - 1)).trimEnd()}…` : s;

// ───────────────────────── pan / zoom viewport

type Tf = { k: number; x: number; y: number };

function Viewport({
  bounds,
  fitKey,
  focus,
  children,
}: {
  bounds: Bounds;
  fitKey: string;
  focus?: { x: number; y: number };
  children: ReactNode;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [t, setT] = useState<Tf>({ k: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const suppress = useRef(false);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.clientWidth,
      h = el.clientHeight;
    const bw = bounds.x1 - bounds.x0,
      bh = bounds.y1 - bounds.y0;
    const k = Math.min(1.1, w / bw, h / bh);
    setT({ k, x: w / 2 - k * (bounds.x0 + bw / 2), y: h / 2 - k * (bounds.y0 + bh / 2) });
  }, [bounds]);

  // Refit when the chart itself changes (mode, focus person, generations), not on every selection.
  useEffect(() => {
    fit();
  }, [fitKey]); // intentionally not depending on `fit`: refit only when the chart itself changes

  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    const el = ref.current;
    if (!el) return;
    const mx = cx ?? el.clientWidth / 2,
      my = cy ?? el.clientHeight / 2;
    setT((p) => {
      const k = Math.min(3, Math.max(0.05, p.k * factor));
      return { k, x: mx - (mx - p.x) * (k / p.k), y: my - (my - p.y) * (k / p.k) };
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const centreOnFocus = () => {
    const el = ref.current;
    if (!el || !focus) return;
    setT((p) => ({
      ...p,
      x: el.clientWidth / 2 - p.k * focus.x,
      y: el.clientHeight / 2 - p.k * focus.y,
    }));
  };

  return (
    <div className="viewport">
      <svg
        ref={ref}
        className="tree-svg"
        role="group"
        aria-label="Family tree chart"
        onPointerDown={(e) => {
          if (e.button === 0) drag.current = { x: e.clientX, y: e.clientY, moved: false };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !(e.buttons & 1)) return;
          const dx = e.clientX - d.x,
            dy = e.clientY - d.y;
          if (!d.moved && Math.hypot(dx, dy) < 4) return;
          d.moved = true;
          d.x = e.clientX;
          d.y = e.clientY;
          setT((p) => ({ ...p, x: p.x + dx, y: p.y + dy }));
        }}
        onPointerUp={() => {
          suppress.current = !!drag.current?.moved;
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
        onClickCapture={(e) => {
          if (suppress.current) {
            e.stopPropagation();
            suppress.current = false;
          }
        }}
      >
        <g transform={`translate(${t.x} ${t.y}) scale(${t.k})`}>{children}</g>
      </svg>
      <div className="zoom-controls">
        <button aria-label="Zoom in" onClick={() => zoomAt(1.25)}>
          <Plus size={15} />
        </button>
        <button aria-label="Zoom out" onClick={() => zoomAt(0.8)}>
          <Minus size={15} />
        </button>
        <button aria-label="Fit chart to window" onClick={fit}>
          <Maximize2 size={14} />
        </button>
        {focus && (
          <button aria-label="Centre on selected person" onClick={centreOnFocus}>
            <LocateFixed size={14} />
          </button>
        )}
      </div>
      <span className="zoom-hint">
        Drag to pan · scroll to zoom · double-click a person to open their record
      </span>
    </div>
  );
}

// ───────────────────────── person card

function Card({
  x,
  y,
  person,
  sub,
  selected,
  onSelect,
  onOpen,
}: {
  x: number;
  y: number;
  person: Person;
  sub?: string;
  selected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const meta = [lifespan(person), person.place.split(",")[0]].filter(Boolean).join(" · ");
  return (
    <g
      transform={`translate(${x} ${y})`}
      role="button"
      tabIndex={0}
      className={`tcard ${person.sex === "F" ? "fem" : person.sex === "M" ? "male" : ""} ${selected ? "sel" : ""}`}
      aria-label={`${person.name}${meta ? `, ${meta}` : ""}`}
      aria-pressed={selected}
      onClick={() => onSelect(person.id)}
      onDoubleClick={() => onOpen(person.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(person.id);
        }
      }}
    >
      <title>{`${person.name}${meta ? ` — ${meta}` : ""}${sub ? ` — ${sub}` : ""}`}</title>
      <rect className="tbox" width={CARD_W} height={CARD_H} rx={9} />
      <rect className="tbar" width={5} height={CARD_H} rx={2.5} />
      <text className="tname" x={15} y={22}>
        {clip(person.name, 22)}
      </text>
      <text className="tmeta" x={15} y={38}>
        {clip(meta || "Dates unknown", 27)}
      </text>
      {sub && (
        <text className="tsub" x={15} y={53}>
          {clip(sub, 28)}
        </text>
      )}
    </g>
  );
}

// ───────────────────────── fan chart

const R0 = 48,
  RING = 100;
const pt = (r: number, a: number) =>
  `${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)}`;

function Fan({
  people,
  families,
  rootId,
  gens,
  onSelect,
  onOpen,
}: {
  people: Person[];
  families: Family[];
  rootId: string;
  gens: number;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const ix = useMemo(() => buildIndex(people, families), [people, families]);
  const slots = useMemo(() => fanSlots(ix, rootId, gens), [ix, rootId, gens]);
  const R = R0 + gens * RING + 20;
  return (
    <Viewport bounds={{ x0: -R, y0: -R, x1: R, y1: R }} fitKey={`fan:${rootId}:${gens}`}>
      {slots.map((s) => {
        const p = s.id ? ix.people.get(s.id) : undefined;
        if (s.gen === 0) {
          return (
            <g
              key={s.n}
              className={`fan-seg root ${p?.sex === "F" ? "fem" : "male"}`}
              role="button"
              tabIndex={0}
              onDoubleClick={() => onOpen(rootId)}
              aria-label={p?.name}
            >
              <circle r={R0} />
              <text className="fan-name" textAnchor="middle" y={-3}>
                {clip(p?.given || p?.name || "", 11)}
              </text>
              <text className="fan-meta" textAnchor="middle" y={12}>
                {p ? lifespan(p) : ""}
              </text>
            </g>
          );
        }
        const span = (2 * Math.PI) / 2 ** s.gen;
        const a0 = -Math.PI / 2 + (s.n - 2 ** s.gen) * span,
          a1 = a0 + span,
          am = (a0 + a1) / 2;
        const ri = R0 + (s.gen - 1) * RING,
          ro = ri + RING;
        const d = `M${pt(ri, a0)}L${pt(ro, a0)}A${ro} ${ro} 0 0 1 ${pt(ro, a1)}L${pt(ri, a1)}A${ri} ${ri} 0 0 0 ${pt(ri, a0)}Z`;
        const rm = (ri + ro) / 2;
        const flip = Math.cos(am) < 0;
        const fs = [0, 12, 12, 11.5, 11, 10, 9, 8][s.gen] ?? 8;
        const chars = Math.floor((RING - 8) / (fs * 0.54));
        const arc = rm * span;
        const twoLines = s.gen <= 5 && arc > 30;
        return (
          <g
            key={s.n}
            className={`fan-seg g${s.gen % 4} ${p ? (p.sex === "F" ? "fem" : "male") : "empty"}`}
            role={p ? "button" : undefined}
            tabIndex={p ? 0 : undefined}
            aria-label={p?.name}
            onClick={() => p && onSelect(p.id)}
            onDoubleClick={() => p && onOpen(p.id)}
            onKeyDown={(e) => {
              if (p && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onSelect(p.id);
              }
            }}
          >
            {p && <title>{`${p.name}${lifespan(p) ? ` — ${lifespan(p)}` : ""}`}</title>}
            <path d={d} />
            {p && (
              <g
                transform={`translate(${(rm * Math.cos(am)).toFixed(1)} ${(rm * Math.sin(am)).toFixed(1)}) rotate(${((am * 180) / Math.PI + (flip ? 180 : 0)).toFixed(1)})`}
              >
                <text
                  className="fan-name"
                  textAnchor="middle"
                  fontSize={fs}
                  y={twoLines ? -1 : 4}
                >
                  {clip(s.gen >= 6 ? p.surname || p.name : p.name, chars)}
                </text>
                {twoLines && (
                  <text
                    className="fan-meta"
                    textAnchor="middle"
                    fontSize={fs - 1.5}
                    y={fs + 1}
                  >
                    {lifespan(p)}
                  </text>
                )}
              </g>
            )}
          </g>
        );
      })}
    </Viewport>
  );
}

// ───────────────────────── tree view

export default function TreeView({
  people,
  families,
  selectedId,
  onSelect,
  onOpenRecord,
  initialMode = "hourglass",
}: {
  people: Person[];
  families: Family[];
  selectedId: string;
  initialMode?: Mode;
  onSelect: (id: string) => void;
  onOpenRecord: (id: string) => void;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [anc, setAnc] = useState(4);
  const [desc, setDesc] = useState(3);
  const [find, setFind] = useState("");
  const ix = useMemo(() => buildIndex(people, families), [people, families]);
  const root = ix.people.has(selectedId) ? selectedId : (people[0]?.id ?? "");

  const whole = useMemo(() => (mode === "whole" ? wholeTree(ix) : null), [ix, mode]);
  const layout: Layout | null = useMemo(() => {
    if (!root) return null;
    if (mode === "whole") return whole;
    if (mode === "hourglass") return hourglass(ix, root, anc, desc);
    if (mode === "pedigree") return horizontalTree(ix, root, anc, "pedigree");
    if (mode === "descendants") return horizontalTree(ix, root, desc, "descendants");
    return null;
  }, [ix, root, mode, anc, desc, whole]);

  const focus = useMemo(() => {
    const n = layout?.nodes.find((x) => x.id === root);
    return n ? { x: n.x + CARD_W / 2, y: n.y + CARD_H / 2 } : undefined;
  }, [layout, root]);

  const gensSelect = (
    label: string,
    v: number,
    set: (n: number) => void,
    max: number,
  ) => (
    <label className="gens">
      {label}
      <select value={v} onChange={(e) => set(Number(e.target.value))}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </label>
  );

  const jump = (value: string) => {
    setFind(value);
    const m = people.find((p) => `${p.name} (${p.id})` === value);
    if (m) {
      onSelect(m.id);
      setFind("");
    }
  };

  const sel = ix.people.get(root);
  const count =
    layout?.nodes.length ??
    (mode === "fan" ? fanSlots(ix, root, anc).filter((s) => s.id).length : 0);

  return (
    <div className="tree-view">
      <div className="tree-toolbar">
        <div className="seg" role="tablist" aria-label="Chart type">
          {MODES.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={mode === m.id}
              title={m.hint}
              className={mode === m.id ? "on" : ""}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="tree-opts">
          {(mode === "hourglass" || mode === "pedigree") &&
            gensSelect("Ancestors", anc, setAnc, 8)}
          {mode === "fan" && gensSelect("Generations", Math.min(anc, 7), setAnc, 7)}
          {(mode === "hourglass" || mode === "descendants") &&
            gensSelect("Descendants", desc, setDesc, 8)}
          <input
            list="tree-people"
            className="tree-find"
            placeholder="Jump to person…"
            aria-label="Jump to person"
            value={find}
            onChange={(e) => jump(e.target.value)}
          />
          <datalist id="tree-people">
            {people.map((p) => (
              <option key={p.id} value={`${p.name} (${p.id})`} />
            ))}
          </datalist>
        </div>
      </div>

      {sel && (
        <div className="tree-focus">
          <span>
            <b>{sel.name}</b>
            {lifespan(sel) ? ` · ${lifespan(sel)}` : ""}
          </span>
          <small>
            {mode === "whole" ? `${people.length} people` : `${count} shown`} ·{" "}
            {MODES.find((m) => m.id === mode)!.hint}
          </small>
          <button className="text-button" onClick={() => onOpenRecord(sel.id)}>
            Open record & notes →
          </button>
        </div>
      )}

      {!root ? (
        <p className="no-results">No people to chart.</p>
      ) : mode === "fan" ? (
        <Fan
          people={people}
          families={families}
          rootId={root}
          gens={Math.min(anc, 7)}
          onSelect={onSelect}
          onOpen={onOpenRecord}
        />
      ) : (
        layout && (
          <Viewport
            bounds={layout.bounds}
            focus={focus}
            fitKey={`${mode}:${mode === "whole" ? people.length : root}:${anc}:${desc}`}
          >
            <g className="tlinks">
              {layout.links.map((l, i) => (
                <path key={i} d={l.d} className={l.kind} />
              ))}
            </g>
            {layout.nodes.map((n) => (
              <Card
                key={n.key}
                x={n.x}
                y={n.y}
                person={ix.people.get(n.id)!}
                sub={n.sub}
                selected={n.id === root}
                onSelect={onSelect}
                onOpen={onOpenRecord}
              />
            ))}
          </Viewport>
        )
      )}
    </div>
  );
}
