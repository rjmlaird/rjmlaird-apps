export type Person = {
  id: string;
  name: string;
  given: string;
  surname: string;
  sex: string;
  birth: string;
  place: string;
  death: string;
  famc: string[];
  fams: string[];
};
export type Family = { id: string; husband?: string; wife?: string; children: string[] };

const LINE = /^\s*(\d+)\s+(?:(@[^@]+@)\s+)?(\w+)(?:\s+(.*))?$/;

/** Best-effort GEDCOM 5.5.x reader: INDI/FAM only, first NAME/BIRT/DEAT per person. */
export function parse(source: string): { people: Person[]; families: Family[] } {
  const people: Record<string, Person> = {};
  const families: Record<string, Family> = {};
  let person: Person | undefined;
  let family: Family | undefined;
  let event: "" | "BIRT" | "DEAT" = "";
  let named = false;

  for (const line of source.replace(/^\uFEFF/, "").split(/\r\n|\r|\n/)) {
    const m = line.match(LINE);
    if (!m) continue;
    const level = Number(m[1]);
    const id = m[2];
    const tag = m[3].toUpperCase();
    const value = (m[4] ?? "").trim();

    if (level === 0) {
      // Every level-0 record ends the previous one (HEAD, SUBM, SOUR, NOTE, TRLR...).
      person = undefined;
      family = undefined;
      event = "";
      named = false;
      if (tag === "INDI" && id) {
        person = people[id] = {
          id,
          name: id,
          given: "",
          surname: "",
          sex: "",
          birth: "",
          place: "",
          death: "",
          famc: [],
          fams: [],
        };
      } else if (tag === "FAM" && id) {
        family = families[id] = { id, children: [] };
      }
      continue;
    }

    if (level === 1) {
      event = tag === "BIRT" || tag === "DEAT" ? tag : "";
      if (person) {
        if (tag === "NAME" && !named) {
          named = true;
          const q = value.match(/^(.*?)\s*\/(.*?)\/\s*(.*)$/);
          person.name =
            value.replace(/\//g, " ").replace(/\s+/g, " ").trim() || person.id;
          person.given = (q ? `${q[1]} ${q[3]}`.trim() : value) || person.name;
          person.surname = q?.[2].trim() ?? "";
        } else if (tag === "SEX") person.sex = value;
        else if (tag === "FAMC") person.famc.push(value);
        else if (tag === "FAMS") person.fams.push(value);
      } else if (family) {
        if (tag === "HUSB") family.husband = value;
        else if (tag === "WIFE") family.wife = value;
        else if (tag === "CHIL") family.children.push(value);
      }
      continue;
    }

    if (level === 2 && person && event) {
      if (tag === "DATE") {
        if (event === "BIRT" && !person.birth) person.birth = value;
        if (event === "DEAT" && !person.death) person.death = value;
      } else if (tag === "PLAC" && event === "BIRT" && !person.place)
        person.place = value;
    }
  }
  reconcileLinks(people, families);
  return { people: Object.values(people), families: Object.values(families) };
}

/** GEDCOM files often record a link on one side only (FAMC without CHIL, etc.). Make both sides agree and drop dangling refs. */
function reconcileLinks(
  people: Record<string, Person>,
  families: Record<string, Family>,
) {
  for (const p of Object.values(people)) {
    p.famc = [...new Set(p.famc)].filter((id) => families[id]);
    p.fams = [...new Set(p.fams)].filter((id) => families[id]);
    for (const id of p.famc)
      if (!families[id].children.includes(p.id)) families[id].children.push(p.id);
    for (const id of [...p.fams]) {
      const f = families[id];
      if (f.husband === p.id || f.wife === p.id) continue;
      if (!f.husband && (p.sex !== "F" || f.wife)) f.husband = p.id;
      else if (!f.wife) f.wife = p.id;
      else p.fams = p.fams.filter((x) => x !== id);
    }
  }
  for (const f of Object.values(families)) {
    f.children = [...new Set(f.children)].filter((c) => people[c]);
    if (f.husband && !people[f.husband]) f.husband = undefined;
    if (f.wife && !people[f.wife]) f.wife = undefined;
    for (const id of [f.husband, f.wife])
      if (id && !people[id].fams.includes(f.id)) people[id].fams.push(f.id);
    for (const c of f.children)
      if (!people[c].famc.includes(f.id)) people[c].famc.push(f.id);
  }
}

export function hash(s: string): string {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
