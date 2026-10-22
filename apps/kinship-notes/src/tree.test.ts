import { test, expect } from "vitest";
import { parse } from "./gedcom";
import {
  buildIndex,
  horizontalTree,
  hourglass,
  fanSlots,
  wholeTree,
  generations,
  CARD_W,
  CARD_H,
  type Layout,
} from "./tree";

/** Binary ancestry of depth `d` for person I1, plus a married-in spouse and children for I1. */
function sample(depth = 4) {
  const L: string[] = ["0 HEAD"];
  let nPeople = 0;
  const fam: string[] = [];
  const mk = (sex: string) => {
    const id = `@I${++nPeople}@`;
    L.push(
      `0 ${id} INDI`,
      `1 NAME P${nPeople} /Fam/`,
      `1 SEX ${sex}`,
      `1 BIRT`,
      `2 DATE ${1900 - nPeople}`,
    );
    return id;
  };
  const root = mk("M");
  const build = (child: string, d: number) => {
    if (d === 0) return;
    const f = mk("M"),
      m = mk("F"),
      fid = `@F${fam.length + 1}@`;
    fam.push(`0 ${fid} FAM`, `1 HUSB ${f}`, `1 WIFE ${m}`, `1 CHIL ${child}`);
    build(f, d - 1);
    build(m, d - 1);
  };
  build(root, depth);
  // spouse + 3 children for root
  const sp = mk("F");
  fam.push(`0 @FS@ FAM`, `1 HUSB ${root}`, `1 WIFE ${sp}`);
  for (let i = 0; i < 3; i++) {
    const c = mk(i % 2 ? "F" : "M");
    fam.push(`1 CHIL ${c}`);
  }
  return { text: [...L, ...fam, "0 TRLR"].join("\n"), root, total: nPeople };
}

const overlaps = (l: Layout) => {
  for (let i = 0; i < l.nodes.length; i++)
    for (let j = i + 1; j < l.nodes.length; j++) {
      const a = l.nodes[i],
        b = l.nodes[j];
      if (Math.abs(a.x - b.x) < CARD_W && Math.abs(a.y - b.y) < CARD_H)
        return `${a.key} overlaps ${b.key}`;
    }
  return "";
};

test("whole tree places every person exactly once with no overlaps", () => {
  const { text, total } = sample(4);
  const { people, families } = parse(text);
  const ix = buildIndex(people, families);
  const l = wholeTree(ix);
  expect(l.nodes.length).toBe(total);
  expect(new Set(l.nodes.map((n) => n.id)).size).toBe(total);
  expect(overlaps(l)).toBe("");
});

test("generations: children below parents, spouses share a row", () => {
  const { text, root } = sample(3);
  const { people, families } = parse(text);
  const ix = buildIndex(people, families);
  const g = generations(ix);
  for (const f of families) {
    const ps = [f.husband, f.wife].filter(Boolean) as string[];
    if (ps.length === 2) expect(g.get(ps[0])).toBe(g.get(ps[1]));
    for (const c of f.children) expect(g.get(c)! > g.get(ps[0])!).toBeTruthy();
  }
  expect(g.get(root)).toBe(3);
});

test("pedigree, descendants and hourglass respect generation limits", () => {
  const { text, root } = sample(4);
  const { people, families } = parse(text);
  const ix = buildIndex(people, families);
  expect(horizontalTree(ix, root, 3, "pedigree").nodes.length).toBe(1 + 2 + 4 + 8);
  expect(horizontalTree(ix, root, 1, "descendants").nodes.length).toBe(1 + 3);
  const h = hourglass(ix, root, 2, 1);
  expect(h.nodes.length).toBe(1 + 2 + 4 + 3);
  expect(h.nodes.filter((n) => n.id === root).length).toBe(1);
  expect(overlaps(h)).toBe("");
});

test("fan slots follow Ahnentafel numbering", () => {
  const { text, root } = sample(3);
  const { people, families } = parse(text);
  const ix = buildIndex(people, families);
  const slots = fanSlots(ix, root, 3);
  expect(slots.length).toBe(15);
  expect(slots.filter((s) => s.id).length).toBe(1 + 2 + 4 + 8);
  expect(ix.people.get(slots[1].id!)!.sex).toBe("M"); // slot 2 = father
  expect(ix.people.get(slots[2].id!)!.sex).toBe("F"); // slot 3 = mother
});

test("cyclic or self-referential data terminates", () => {
  const { people, families } = parse(
    [
      "0 @I1@ INDI",
      "1 NAME A /X/",
      "1 FAMC @F2@",
      "1 FAMS @F1@",
      "0 @I2@ INDI",
      "1 NAME B /X/",
      "1 FAMC @F1@",
      "1 FAMS @F2@",
      "0 @F1@ FAM",
      "1 HUSB @I1@",
      "1 CHIL @I2@",
      "0 @F2@ FAM",
      "1 HUSB @I2@",
      "1 CHIL @I1@",
    ].join("\n"),
  );
  const ix = buildIndex(people, families);
  expect(wholeTree(ix).nodes.length).toBe(2);
  expect(horizontalTree(ix, "@I1@", 6, "pedigree").nodes.length <= 7).toBeTruthy();
  expect(hourglass(ix, "@I1@", 5, 5).nodes.length < 20).toBeTruthy();
});
