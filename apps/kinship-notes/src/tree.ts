import type { Person, Family } from "./gedcom";

export const CARD_W = 176;
export const CARD_H = 62;
const GAP_X = 28; // horizontal gap between sibling cards
const GAP_Y = 14; // vertical gap between stacked cards (horizontal charts)
const COL_GAP = 64; // gap between generations in horizontal charts
const ROW_GAP = 70; // gap between generations in vertical charts

export type Index = { people: Map<string, Person>; families: Map<string, Family> };
export type PNode = { key: string; id: string; x: number; y: number; sub?: string };
export type Link = { d: string; kind: "descent" | "marriage" };
export type Bounds = { x0: number; y0: number; x1: number; y1: number };
export type Layout = { nodes: PNode[]; links: Link[]; bounds: Bounds };

export function buildIndex(people: Person[], families: Family[]): Index {
  return {
    people: new Map(people.map((p) => [p.id, p])),
    families: new Map(families.map((f) => [f.id, f])),
  };
}

/** [father, mother] of the first family in which the person is a child and at least one parent is known. */
export function parentSlots(
  ix: Index,
  id: string,
): [string | undefined, string | undefined] {
  const p = ix.people.get(id);
  for (const fid of p?.famc ?? []) {
    const f = ix.families.get(fid);
    if (!f) continue;
    const h = f.husband && ix.people.has(f.husband) ? f.husband : undefined;
    const w = f.wife && ix.people.has(f.wife) ? f.wife : undefined;
    if (h || w) return [h, w];
  }
  return [undefined, undefined];
}
export const parentsOf = (ix: Index, id: string) =>
  parentSlots(ix, id).filter((x): x is string => !!x);

export function childrenOf(ix: Index, id: string): string[] {
  const out: string[] = [];
  for (const fid of ix.people.get(id)?.fams ?? [])
    for (const c of ix.families.get(fid)?.children ?? [])
      if (ix.people.has(c) && !out.includes(c)) out.push(c);
  return out;
}

export function spousesOf(ix: Index, id: string): string[] {
  const out: string[] = [];
  for (const fid of ix.people.get(id)?.fams ?? []) {
    const f = ix.families.get(fid);
    if (!f) continue;
    for (const s of [f.husband, f.wife])
      if (s && s !== id && ix.people.has(s) && !out.includes(s)) out.push(s);
  }
  return out;
}

const year = (s: string) => s.match(/\b(\d{3,4})\b/)?.[1] ?? "";
export function lifespan(p: Person): string {
  const b = year(p.birth),
    d = year(p.death);
  if (!b && !d) return "";
  return d ? `${b || "?"}–${d}` : `b. ${b}`;
}

// ───────────────────────── tree-shaped views (pedigree, descendants, hourglass)

type TNode = { id: string; depth: number; kids: TNode[]; b: number };

function grow(
  id: string,
  depth: number,
  max: number,
  next: (id: string) => string[],
  path: Set<string>,
): TNode {
  const n: TNode = { id, depth, kids: [], b: 0 };
  if (depth < max) {
    path.add(id);
    for (const k of next(id))
      if (!path.has(k)) n.kids.push(grow(k, depth + 1, max, next, path));
    path.delete(id);
  }
  return n;
}
function assignBreadth(n: TNode, c = { v: 0 }) {
  if (!n.kids.length) {
    n.b = c.v++;
    return;
  }
  n.kids.forEach((k) => assignBreadth(k, c));
  n.b = (n.kids[0].b + n.kids[n.kids.length - 1].b) / 2;
}
function walk(n: TNode, fn: (n: TNode, parent?: TNode) => void, parent?: TNode) {
  fn(n, parent);
  n.kids.forEach((k) => walk(k, fn, n));
}

const spouseLabel = (ix: Index, id: string) => {
  const names = spousesOf(ix, id).map((s) => ix.people.get(s)!.name);
  return names.length ? `⚭ ${names.join(", ")}` : undefined;
};
const boundsOf = (nodes: PNode[]): Bounds => {
  if (!nodes.length) return { x0: 0, y0: 0, x1: CARD_W, y1: CARD_H };
  return {
    x0: Math.min(...nodes.map((n) => n.x)) - 30,
    y0: Math.min(...nodes.map((n) => n.y)) - 30,
    x1: Math.max(...nodes.map((n) => n.x + CARD_W)) + 30,
    y1: Math.max(...nodes.map((n) => n.y + CARD_H)) + 30,
  };
};
const hLink = (a: PNode, b: PNode): Link => {
  const x1 = a.x + CARD_W,
    y1 = a.y + CARD_H / 2,
    x2 = b.x,
    y2 = b.y + CARD_H / 2,
    xm = (x1 + x2) / 2;
  return { d: `M${x1} ${y1}C${xm} ${y1} ${xm} ${y2} ${x2} ${y2}`, kind: "descent" };
};
const vLink = (a: PNode, b: PNode, down: boolean): Link => {
  const x1 = a.x + CARD_W / 2,
    x2 = b.x + CARD_W / 2;
  const y1 = down ? a.y + CARD_H : a.y,
    y2 = down ? b.y : b.y + CARD_H,
    ym = (y1 + y2) / 2;
  return { d: `M${x1} ${y1}C${x1} ${ym} ${x2} ${ym} ${x2} ${y2}`, kind: "descent" };
};

/** Left-to-right chart: root on the left, ancestors (pedigree) or descendants flowing right. */
export function horizontalTree(
  ix: Index,
  id: string,
  gens: number,
  mode: "pedigree" | "descendants",
): Layout {
  const root = grow(
    id,
    0,
    gens,
    mode === "pedigree" ? (pid) => parentsOf(ix, pid) : (pid) => childrenOf(ix, pid),
    new Set(),
  );
  assignBreadth(root);
  const nodes: PNode[] = [],
    links: Link[] = [],
    byNode = new Map<TNode, PNode>();
  let i = 0;
  walk(root, (n, parent) => {
    const pn: PNode = {
      key: `${i++}:${n.id}`,
      id: n.id,
      x: n.depth * (CARD_W + COL_GAP),
      y: n.b * (CARD_H + GAP_Y),
      sub: mode === "descendants" ? spouseLabel(ix, n.id) : undefined,
    };
    nodes.push(pn);
    byNode.set(n, pn);
    if (parent) links.push(hLink(byNode.get(parent)!, pn));
  });
  return { nodes, links, bounds: boundsOf(nodes) };
}

/** Ancestors above, descendants below, root in the middle. */
export function hourglass(
  ix: Index,
  id: string,
  ancGens: number,
  descGens: number,
): Layout {
  const up = grow(id, 0, ancGens, (pid) => parentsOf(ix, pid), new Set());
  const down = grow(id, 0, descGens, (pid) => childrenOf(ix, pid), new Set());
  assignBreadth(up);
  assignBreadth(down);
  const nodes: PNode[] = [],
    links: Link[] = [];
  const step = CARD_W + GAP_X;
  for (const [tree, sign] of [
    [up, -1],
    [down, 1],
  ] as const) {
    const byNode = new Map<TNode, PNode>();
    let i = 0;
    walk(tree, (n, parent) => {
      if (sign === 1 && !parent) {
        byNode.set(
          n,
          nodes.find((x) => x.key.startsWith("0:"))!,
        );
        return;
      }
      const pn: PNode = {
        key: `${sign < 0 ? "a" : "d"}${i++}:${n.id}`,
        id: n.id,
        x: (n.b - tree.b) * step,
        y: sign * n.depth * (CARD_H + ROW_GAP),
        sub: sign > 0 || !parent ? spouseLabel(ix, n.id) : undefined,
      };
      if (!parent) pn.key = `0:${n.id}`;
      nodes.push(pn);
      byNode.set(n, pn);
      if (parent) links.push(vLink(byNode.get(parent)!, pn, sign > 0));
    });
  }
  return { nodes, links, bounds: boundsOf(nodes) };
}

// ───────────────────────── fan chart

export type FanSlot = { n: number; gen: number; id?: string };
/** Ahnentafel numbering: n = person, 2n = father, 2n+1 = mother. */
export function fanSlots(ix: Index, id: string, gens: number): FanSlot[] {
  const at = new Map<number, string>([[1, id]]);
  const out: FanSlot[] = [{ n: 1, gen: 0, id }];
  for (let g = 1; g <= gens; g++)
    for (let n = 2 ** g; n < 2 ** (g + 1); n++) {
      const child = at.get(n >> 1);
      if (child) {
        const pid = parentSlots(ix, child)[n % 2];
        if (pid) at.set(n, pid);
      }
      out.push({ n, gen: g, id: at.get(n) });
    }
  return out;
}

// ───────────────────────── whole tree

/** Generation number per person: children sit below parents, spouses share a row. */
export function generations(ix: Index): Map<string, number> {
  const g = new Map<string, number>();
  for (const id of ix.people.keys()) g.set(id, 0);
  const fams = [...ix.families.values()];
  for (let it = 0; it < ix.people.size + 5; it++) {
    let changed = false;
    const set = (id: string, v: number) => {
      if ((g.get(id) ?? 0) < v) {
        g.set(id, v);
        changed = true;
      }
    };
    for (const f of fams) {
      const ps = [f.husband, f.wife].filter((x): x is string => !!x && ix.people.has(x));
      const pg = Math.max(0, ...ps.map((p) => g.get(p)!));
      ps.forEach((p) => set(p, pg));
      for (const c of f.children) if (ix.people.has(c)) set(c, pg + 1);
    }
    for (const id of ix.people.keys()) {
      if (parentsOf(ix, id).length) continue;
      const kids = childrenOf(ix, id).map((k) => g.get(k)!);
      if (kids.length) set(id, Math.min(...kids) - 1);
    }
    if (!changed) break;
  }
  return g;
}

/** Every person once: couples side by side, children centred beneath, one row per generation. */
export function wholeTree(ix: Index): Layout {
  const gen = generations(ix);
  const ids = [...ix.people.keys()];
  const placed = new Set<string>();
  const slots: { id: string; s: number }[] = [];

  const place = (pid: string, s0: number): number => {
    placed.add(pid);
    const left: string[] = [],
      right: string[] = [];
    spousesOf(ix, pid)
      .filter((s) => !placed.has(s))
      .forEach((s, i) => {
        placed.add(s);
        (i % 2 === 0 ? right : left).push(s);
      });
    const cluster = [...left.reverse(), pid, ...right];
    const start = slots.length;
    let cx = s0;
    for (const m of cluster)
      for (const c of childrenOf(ix, m)) if (!placed.has(c)) cx += place(c, cx);
    const kw = cx - s0,
      cw = cluster.length;
    if (cw > kw) for (let i = start; i < slots.length; i++) slots[i].s += (cw - kw) / 2;
    const first = s0 + Math.max(0, (kw - cw) / 2);
    cluster.forEach((id, i) => slots.push({ id, s: first + i }));
    return Math.max(kw, cw);
  };

  let cursor = 0;
  const roots = ids
    .filter((id) => parentsOf(ix, id).length === 0)
    .sort((a, b) => gen.get(a)! - gen.get(b)!);
  for (const id of [...roots, ...ids])
    if (!placed.has(id)) cursor += place(id, cursor) + 0.5;

  const step = CARD_W + GAP_X,
    rowH = CARD_H + ROW_GAP;
  const nodes: PNode[] = slots.map(({ id, s }) => ({
    key: id,
    id,
    x: s * step,
    y: gen.get(id)! * rowH,
  }));
  const at = new Map(nodes.map((n) => [n.id, n]));
  const links: Link[] = [];

  for (const f of ix.families.values()) {
    const ps = [f.husband, f.wife]
      .filter((x): x is string => !!x && at.has(x))
      .map((x) => at.get(x)!);
    const kids = f.children.filter((c) => at.has(c)).map((c) => at.get(c)!);
    if (ps.length === 2) {
      const [a, b] = ps[0].x <= ps[1].x ? ps : [ps[1], ps[0]];
      if (a.y === b.y && Math.abs(b.x - a.x - step) < 1)
        links.push({
          d: `M${a.x + CARD_W} ${a.y + CARD_H / 2}L${b.x} ${b.y + CARD_H / 2}`,
          kind: "marriage",
        });
    }
    if (!ps.length || !kids.length) continue;
    const yb = Math.max(...ps.map((p) => p.y)) + CARD_H,
      yj = yb + ROW_GAP / 2;
    const xs = ps.map((p) => p.x + CARD_W / 2),
      jx = xs.reduce((a, b) => a + b, 0) / xs.length;
    ps.forEach((p) =>
      links.push({
        d: `M${p.x + CARD_W / 2} ${p.y + CARD_H}L${p.x + CARD_W / 2} ${yj}`,
        kind: "descent",
      }),
    );
    if (xs.length === 2)
      links.push({
        d: `M${Math.min(...xs)} ${yj}L${Math.max(...xs)} ${yj}`,
        kind: "descent",
      });
    for (const k of kids) {
      const kx = k.x + CARD_W / 2,
        ym = (yj + k.y) / 2;
      links.push({
        d: `M${jx} ${yj}C${jx} ${ym} ${kx} ${ym} ${kx} ${k.y}`,
        kind: "descent",
      });
    }
  }
  return { nodes, links, bounds: boundsOf(nodes) };
}
