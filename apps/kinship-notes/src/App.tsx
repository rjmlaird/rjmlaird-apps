import { useEffect, useMemo, useRef, useState } from "react";
import TreeView from "./TreeView";
import { parse, hash, type Person, type Family } from "./gedcom";
import {
  BookOpen,
  Check,
  CircleHelp,
  Download,
  FileUp,
  GitBranch,
  Plus,
  Search,
  ShieldCheck,
  Upload,
  Users,
  X,
} from "lucide-react";
type Kind = "Note" | "Question" | "Task" | "Hypothesis";
type Annotation = {
  id: string;
  personId: string;
  kind: Kind;
  text: string;
  done: boolean;
  createdAt: string;
};
type Sidecar = {
  schemaVersion: number;
  gedcomFingerprint: string;
  sourceName: string;
  annotations: Annotation[];
};
const KEY = "kinship-notes-sidecar-v1",
  KEY2 = "kinship-notes-sidecars-v2",
  uid = () =>
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
  KINDS: Kind[] = ["Note", "Question", "Task", "Hypothesis"],
  isAnnotation = (value: unknown): value is Annotation => {
    const a = value as Partial<Annotation> | null;
    return (
      !!a &&
      typeof a.id === "string" &&
      typeof a.personId === "string" &&
      typeof a.text === "string" &&
      KINDS.includes(a.kind as Kind)
    );
  },
  loadSidecars = (): Record<string, Sidecar> => {
    try {
      const v2 = JSON.parse(localStorage.getItem(KEY2) || "null");
      if (v2 && typeof v2 === "object") return v2;
      const v1 = JSON.parse(localStorage.getItem(KEY) || "null");
      if (v1?.sourceName && Array.isArray(v1.annotations)) return { [v1.sourceName]: v1 };
    } catch {
      // Storage unavailable or corrupt: start with no saved notes.
    }
    return {};
  },
  SAMPLE = `0 HEAD\n1 GEDC\n2 VERS 5.5.1\n1 CHAR UTF-8\n0 @I1@ INDI\n1 NAME Ada /Morgan/\n1 SEX F\n1 BIRT\n2 DATE 12 MAR 1874\n2 PLAC Leicester, England\n1 FAMS @F1@\n0 @I2@ INDI\n1 NAME Thomas /Morgan/\n1 SEX M\n1 BIRT\n2 DATE 1842\n1 FAMS @F1@\n0 @I3@ INDI\n1 NAME Ellen /Price/\n1 SEX F\n1 BIRT\n2 DATE 1848\n1 FAMS @F1@\n0 @I4@ INDI\n1 NAME James /Morgan/\n1 SEX M\n1 BIRT\n2 DATE 1877\n1 FAMC @F1@\n0 @F1@ FAM\n1 HUSB @I2@\n1 WIFE @I3@\n1 CHIL @I1@\n1 CHIL @I4@\n0 TRLR`;
function initials(p: Person) {
  return `${p.given[0] || p.name[0] || "?"}${p.surname[0] || ""}`.toUpperCase();
}
function saveFile(n: string, s: string, type: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([s], { type }));
  a.download = n;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
}
export default function App() {
  const [raw, setRaw] = useState(""),
    [name, setName] = useState(""),
    [people, setPeople] = useState<Person[]>([]),
    [families, setFamilies] = useState<Family[]>([]),
    [selected, setSelected] = useState(""),
    [query, setQuery] = useState(""),
    [annotations, setAnnotations] = useState<Annotation[]>([]),
    [kind, setKind] = useState<Kind>("Note"),
    [text, setText] = useState(""),
    [banner, setBanner] = useState(""),
    [about, setAbout] = useState(false),
    [tab, setTab] = useState<"record" | "tree">("record");
  const input = useRef<HTMLInputElement>(null),
    side = useRef<HTMLInputElement>(null),
    fp = useMemo(() => hash(raw), [raw]),
    person = people.find((p) => p.id === selected) || people[0],
    notes = annotations.filter((a) => a.personId === person?.id),
    filtered = people.filter((p) =>
      [p.name, p.birth, p.place, p.id]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  useEffect(() => {
    try {
      const t = JSON.parse(localStorage.getItem("kinship-tree") || "null");
      if (t?.raw) {
        const d = parse(t.raw),
          sc = loadSidecars()[t.name];
        setRaw(t.raw);
        setName(t.name);
        setPeople(d.people);
        setFamilies(d.families);
        setSelected(d.people[0]?.id || "");
        setAnnotations((sc?.annotations || []).filter(isAnnotation));
      }
    } catch {
      // Storage unavailable or corrupt: start empty.
    }
  }, []);
  useEffect(() => {
    if (!raw) return;
    try {
      localStorage.setItem("kinship-tree", JSON.stringify({ raw, name }));
      const all = loadSidecars();
      all[name] = {
        schemaVersion: 1,
        gedcomFingerprint: fp,
        sourceName: name,
        annotations,
      };
      localStorage.setItem(KEY2, JSON.stringify(all));
    } catch {
      setBanner(
        "Could not save to this browser (storage may be full). Export your notes as a JSON backup now.",
      );
    }
  }, [raw, name, annotations, fp]);
  function openFile(f?: File) {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const s = String(r.result || ""),
        d = parse(s),
        sc = loadSidecars()[f.name],
        changed = !!sc && sc.gedcomFingerprint !== hash(s);
      setRaw(s);
      setName(f.name);
      setPeople(d.people);
      setFamilies(d.families);
      setSelected(d.people[0]?.id || "");
      setAnnotations((sc?.annotations || []).filter(isAnnotation));
      setBanner(
        `Imported ${d.people.length} people from ${f.name}.${sc ? ` Restored ${sc.annotations.length} saved notes.` : ""}${changed ? " This file differs from the one your notes were made against, so check they still point at the right people." : ""}`,
      );
      setTimeout(() => setBanner(""), changed ? 9000 : 4500);
    };
    r.readAsText(f);
  }
  function demo() {
    const d = parse(SAMPLE),
      sc = loadSidecars()["Sample family.ged"];
    setAnnotations((sc?.annotations || []).filter(isAnnotation));
    setRaw(SAMPLE);
    setName("Sample family.ged");
    setPeople(d.people);
    setFamilies(d.families);
    setSelected(d.people[0]?.id || "");
  }
  function add() {
    if (!person || !text.trim()) return;
    setAnnotations((x) => [
      {
        id: uid(),
        personId: person.id,
        kind,
        text: text.trim(),
        done: false,
        createdAt: new Date().toISOString(),
      },
      ...x,
    ]);
    setText("");
  }
  function exportSidecar() {
    saveFile(
      "kinship-notes-annotations.json",
      JSON.stringify(
        {
          schemaVersion: 1,
          gedcomFingerprint: fp,
          sourceName: name,
          annotations,
        } satisfies Sidecar,
        null,
        2,
      ),
      "application/json",
    );
  }
  function importSidecar(f?: File) {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const x = JSON.parse(String(r.result));
        if (!Array.isArray(x.annotations)) throw Error();
        const good: Annotation[] = x.annotations
            .filter(isAnnotation)
            .map((a: Annotation) => ({
              ...a,
              done: !!a.done,
              createdAt: a.createdAt || new Date().toISOString(),
            })),
          ids = new Set(annotations.map((a) => a.id)),
          fresh = good.filter((a) => !ids.has(a.id)),
          known = new Set(people.map((p) => p.id)),
          orphans = fresh.filter((a) => !known.has(a.personId)).length,
          skipped = x.annotations.length - good.length;
        setAnnotations((old) => [...old, ...fresh]);
        setBanner(
          `Imported ${fresh.length} new notes.${x.gedcomFingerprint === fp ? "" : " The source fingerprint differs, so review matches."}${orphans ? ` ${orphans} refer to people not in this tree.` : ""}${skipped ? ` ${skipped} invalid entries skipped.` : ""}`,
        );
        setTimeout(() => setBanner(""), 6000);
      } catch {
        setBanner("Could not read that annotation file.");
      }
    };
    r.readAsText(f);
  }
  const fs = person
      ? ([...person.famc, ...person.fams]
          .map((id) => families.find((f) => f.id === id))
          .filter(Boolean) as Family[])
      : [],
    relatives = person
      ? ([
          ...new Set(
            fs.flatMap((f) =>
              [f.husband, f.wife, ...f.children].filter(
                (x): x is string => !!x && x !== person.id,
              ),
            ),
          ),
        ]
          .map((id) => people.find((p) => p.id === id))
          .filter(Boolean) as Person[])
      : [];
  function relation(r: Person) {
    const f = fs.find((x) => x.children.includes(person!.id));
    if (f && (r.id === f.husband || r.id === f.wife)) return "Parent";
    if (fs.some((x) => x.children.includes(person!.id) && x.children.includes(r.id)))
      return "Sibling";
    if (
      fs.some(
        (x) =>
          (x.husband === person!.id || x.wife === person!.id) &&
          x.children.includes(r.id),
      )
    )
      return "Child";
    if (
      fs.some(
        (x) =>
          (x.husband === person!.id || x.wife === person!.id) &&
          (x.husband === r.id || x.wife === r.id),
      )
    )
      return "Partner";
    return "Family";
  }
  return (
    <div className="app">
      <header>
        <a className="brand">
          <span>
            <GitBranch size={18} />
          </span>
          kinship<i>notes</i>
        </a>
        <div className="head-actions">
          <small>
            <ShieldCheck size={14} /> Private by design
          </small>
          <button className="button secondary" onClick={() => input.current?.click()}>
            <FileUp size={15} /> Import GEDCOM
          </button>
          <input
            ref={input}
            hidden
            type="file"
            accept=".ged,.gedcom,text/plain"
            onChange={(e) => {
              openFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </header>
      <main>
        <section className="hero">
          <div>
            <small className="eyebrow">YOUR PRIVATE RESEARCH DESK</small>
            <h1>
              Every family has
              <br />
              <em>more to discover.</em>
            </h1>
            <p>
              Explore your family tree. Keep questions, leads and notes alongside
              it—without changing your GEDCOM.
            </p>
          </div>
          <div className="art" aria-hidden="true">
            <span className="ring" />
            <span className="ring ring2" />
            <b className="n n1">✳</b>
            <b className="n n2">✳</b>
            <b className="n n3">✳</b>
            <b className="n n4">✳</b>
            <b className="n n5">✳</b>
            <i>
              stories
              <br />
              connected
            </i>
          </div>
        </section>
        {!people.length ? (
          <section className="welcome card">
            <div className="welcome-icon">
              <Users size={25} />
            </div>
            <h2>Bring your family story in</h2>
            <p>
              Choose a GEDCOM file to start a private research workspace. Your file stays
              in this browser.
            </p>
            <div className="welcome-actions">
              <button className="button primary" onClick={() => input.current?.click()}>
                <Upload size={15} /> Choose GEDCOM file
              </button>
              <button className="text-button" onClick={demo}>
                Explore a sample tree →
              </button>
            </div>
            <small className="privacy-note">
              <ShieldCheck size={13} /> Local-first · No account · Original file is never
              modified
            </small>
          </section>
        ) : (
          <>
            <div className="work-head">
              <div>
                <small className="eyebrow">RESEARCH WORKSPACE</small>
                <h2>{name}</h2>
              </div>
              <div className="work-buttons">
                <button className="button secondary" onClick={exportSidecar}>
                  <Download size={14} /> Export notes
                </button>
                <button
                  className="button secondary"
                  onClick={() => side.current?.click()}
                >
                  <BookOpen size={14} /> Import notes
                </button>
                <input
                  ref={side}
                  hidden
                  type="file"
                  accept="application/json,.json"
                  onChange={(e) => {
                    importSidecar(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>
            {banner && <div className="banner">{banner}</div>}
            <div className={`layout${tab === "tree" ? " tree-mode" : ""}`}>
              <aside className="card index">
                <div className="index-title">
                  <div>
                    <small className="eyebrow">THE PEOPLE</small>
                    <h3>
                      Family index <small>{people.length}</small>
                    </h3>
                  </div>
                  <button
                    className="icon"
                    aria-label="Import another GEDCOM"
                    onClick={() => input.current?.click()}
                  >
                    <Plus size={17} />
                  </button>
                </div>
                <label className="search">
                  <Search size={15} />
                  <input
                    placeholder="Find a person…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <div className="person-list">
                  {filtered.map((p) => (
                    <button
                      key={p.id}
                      className={`person-row ${person?.id === p.id ? "active" : ""}`}
                      onClick={() => setSelected(p.id)}
                    >
                      <span className={`avatar ${p.sex === "F" ? "fem" : ""}`}>
                        {initials(p)}
                      </span>
                      <span className="who">
                        <b>{p.name}</b>
                        <small>
                          {p.birth || "Dates unknown"}
                          {p.place ? ` · ${p.place.split(",")[0]}` : ""}
                        </small>
                      </span>
                      <small className="num">
                        {annotations.filter((a) => a.personId === p.id).length || ""}
                      </small>
                    </button>
                  ))}
                  {!filtered.length && <p className="no-results">No matches found.</p>}
                </div>
                <div className="index-foot">
                  <span>
                    <Users size={13} /> {people.length} people
                  </span>
                  <span>{families.length} families</span>
                </div>
              </aside>
              <section className="card detail">
                <div className="tabs" role="tablist">
                  <button
                    role="tab"
                    aria-selected={tab === "record"}
                    className={tab === "record" ? "on" : ""}
                    onClick={() => setTab("record")}
                  >
                    Record &amp; notes
                  </button>
                  <button
                    role="tab"
                    aria-selected={tab === "tree"}
                    className={tab === "tree" ? "on" : ""}
                    onClick={() => setTab("tree")}
                  >
                    Family tree
                  </button>
                </div>
                {tab === "tree" ? (
                  <TreeView
                    people={people}
                    families={families}
                    selectedId={person?.id || ""}
                    onSelect={setSelected}
                    onOpenRecord={(id) => {
                      setSelected(id);
                      setTab("record");
                    }}
                  />
                ) : (
                  person && (
                    <>
                      <div className="person-head">
                        <span className={`avatar big ${person.sex === "F" ? "fem" : ""}`}>
                          {initials(person)}
                        </span>
                        <div className="person-title">
                          <small className="eyebrow">
                            PERSON RECORD <i>{person.id}</i>
                          </small>
                          <h2>{person.name}</h2>
                          <p>
                            {person.birth
                              ? `Born ${person.birth}${person.place ? ` · ${person.place}` : ""}`
                              : "Life dates not recorded"}
                            {person.death ? ` · Died ${person.death}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="section-title">
                        <b>FAMILY CONNECTIONS</b>
                        <small>{relatives.length} linked</small>
                      </div>
                      {relatives.length ? (
                        <div className="relative-grid">
                          {relatives.map((r) => (
                            <button
                              key={r.id}
                              className="relative"
                              onClick={() => setSelected(r.id)}
                            >
                              <span
                                className={`avatar mini ${r.sex === "F" ? "fem" : ""}`}
                              >
                                {initials(r)}
                              </span>
                              <span className="relative-who">
                                <b>{r.name}</b>
                                <small>{relation(r)}</small>
                              </span>
                              <small className="date">{r.birth || "—"}</small>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="empty-rel">
                          No family links found in this GEDCOM record.
                        </div>
                      )}
                      <div className="section-title notes-title">
                        <b>YOUR RESEARCH NOTES</b>
                        <small className="private">
                          <ShieldCheck size={12} /> PRIVATE
                        </small>
                      </div>
                      <div className="composer">
                        <div className="composer-top">
                          <select
                            aria-label="Note type"
                            value={kind}
                            onChange={(e) => setKind(e.target.value as Kind)}
                          >
                            <option>Note</option>
                            <option>Question</option>
                            <option>Task</option>
                            <option>Hypothesis</option>
                          </select>
                          <small>For {person.given || person.name.split(" ")[0]}</small>
                        </div>
                        <textarea
                          rows={3}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          onKeyDown={(e) => {
                            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") add();
                          }}
                          placeholder={
                            kind === "Question"
                              ? "What do you still need to find out?"
                              : kind === "Task"
                                ? "What will you investigate next?"
                                : kind === "Hypothesis"
                                  ? "Record a lead to verify…"
                                  : "Add context, an archive reference, or a research log…"
                          }
                        />
                        <div className="composer-foot">
                          <small>Ctrl/⌘ + Enter to save</small>
                          <button
                            className="button primary add"
                            disabled={!text.trim()}
                            onClick={add}
                          >
                            <Plus size={14} /> Add to notes
                          </button>
                        </div>
                      </div>
                      <div className="notes">
                        {notes.length ? (
                          notes.map((a) => (
                            <article
                              className={`annotation ${a.done ? "done" : ""}`}
                              key={a.id}
                            >
                              <span className={`note-icon ${a.kind.toLowerCase()}`}>
                                {a.kind === "Task" ? (
                                  <Check size={14} />
                                ) : a.kind === "Question" ? (
                                  <CircleHelp size={14} />
                                ) : a.kind === "Hypothesis" ? (
                                  "◇"
                                ) : (
                                  <BookOpen size={14} />
                                )}
                              </span>
                              <div className="note-body">
                                <div className="note-meta">
                                  <b className={a.kind.toLowerCase()}>{a.kind}</b>
                                  <time>
                                    {new Date(a.createdAt).toLocaleDateString(undefined, {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </time>
                                </div>
                                <p>{a.text}</p>
                                {a.kind === "Task" && (
                                  <button
                                    className="toggle"
                                    onClick={() =>
                                      setAnnotations((prev) =>
                                        prev.map((x) =>
                                          x.id === a.id ? { ...x, done: !x.done } : x,
                                        ),
                                      )
                                    }
                                  >
                                    {a.done ? "Mark open" : "Mark complete"}
                                  </button>
                                )}
                              </div>
                              <button
                                className="delete"
                                onClick={() =>
                                  setAnnotations((prev) =>
                                    prev.filter((x) => x.id !== a.id),
                                  )
                                }
                                aria-label="Delete note"
                              >
                                <X size={14} />
                              </button>
                            </article>
                          ))
                        ) : (
                          <div className="empty-notes">
                            <span>✳</span>
                            <p>No research notes yet.</p>
                            <small>
                              Capture a question, lead or next step as you go.
                            </small>
                          </div>
                        )}
                      </div>
                    </>
                  )
                )}
              </section>
            </div>
            <div className="footnote">
              <ShieldCheck size={13} /> GEDCOM is read-only. Notes save in this browser;
              export a JSON backup.
            </div>
          </>
        )}
        <footer>
          <span>kinshipnotes · a quieter way to research family</span>
          <button className="text-button" onClick={() => setAbout(true)}>
            About this prototype
          </button>
        </footer>
      </main>
      {about && (
        <div className="shade" onClick={() => setAbout(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setAbout(false)}>
              <X size={17} />
            </button>
            <div className="welcome-icon">
              <CircleHelp size={22} />
            </div>
            <h2>A careful first step</h2>
            <p>
              This prototype reads common person and family details from GEDCOM and keeps
              annotations separately in this browser.
            </p>
            <ul>
              <li>Your GEDCOM is not rewritten or sent to a server.</li>
              <li>Export notes to make a portable JSON backup.</li>
              <li>
                The parser is best-effort, not a complete validator. Keep your original
                file and review imported details.
              </li>
            </ul>
            <button className="button primary" onClick={() => setAbout(false)}>
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
