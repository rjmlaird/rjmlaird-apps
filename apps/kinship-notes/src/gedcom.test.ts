import { test, expect } from "vitest";
import { parse } from "./gedcom";

const G = (...l: string[]) => l.join("\n");

test("basic person, event and family parsing", () => {
  const { people, families } = parse(
    G(
      "0 HEAD",
      "0 @I1@ INDI",
      "1 NAME Ada /Morgan/",
      "1 SEX F",
      "1 BIRT",
      "2 DATE 12 MAR 1874",
      "2 PLAC Leicester, England",
      "1 FAMS @F1@",
      "0 @F1@ FAM",
      "1 HUSB @I2@",
      "1 CHIL @I1@",
      "0 TRLR",
    ),
  );
  expect(people[0].name).toBe("Ada Morgan");
  expect(people[0].given).toBe("Ada");
  expect(people[0].surname).toBe("Morgan");
  expect(people[0].birth).toBe("12 MAR 1874");
  expect(families[0].children).toEqual(["@I1@"]);
});

test("other level-1 events do not overwrite birth date", () => {
  const { people } = parse(
    G(
      "0 @I1@ INDI",
      "1 BIRT",
      "2 DATE 1800",
      "1 BAPM",
      "2 DATE 1801",
      "1 CHR",
      "2 PLAC Church",
    ),
  );
  expect(people[0].birth).toBe("1800");
  expect(people[0].place).toBe("");
});

test("non-INDI/FAM records do not leak into the previous person", () => {
  const { people } = parse(
    G(
      "0 @I1@ INDI",
      "1 NAME Ada /Morgan/",
      "0 @U1@ SUBM",
      "1 NAME Researcher /Jones/",
      "0 TRLR",
    ),
  );
  expect(people[0].name).toBe("Ada Morgan");
});

test("only the first NAME is used; surname-first and bare names work", () => {
  const a = parse(G("0 @I1@ INDI", "1 NAME Ada /Morgan/", "1 NAME Addie /Smith/"))
    .people[0];
  expect(a.surname).toBe("Morgan");
  const b = parse(G("0 @I1@ INDI", "1 NAME /Morgan/ Ada")).people[0];
  expect(b.given).toBe("Ada");
  expect(b.surname).toBe("Morgan");
  const c = parse(G("0 @I1@ INDI", "1 NAME Cher")).people[0];
  expect(c.name).toBe("Cher");
  expect(c.surname).toBe("");
});

test("CR-only and CRLF line endings and BOM", () => {
  expect(parse("\uFEFF0 @I1@ INDI\r1 NAME A /B/\r0 TRLR").people[0].name).toBe("A B");
  expect(parse("0 @I1@ INDI\r\n1 NAME A /B/\r\n").people[0].name).toBe("A B");
});

test("one-sided links are reconciled and dangling refs dropped", () => {
  const { people, families } = parse(
    G(
      "0 @I1@ INDI",
      "1 NAME A /X/",
      "1 FAMC @F1@",
      "0 @I2@ INDI",
      "1 NAME B /X/",
      "1 SEX M",
      "1 FAMS @F1@",
      "0 @I3@ INDI",
      "1 NAME C /X/",
      "1 FAMS @F9@",
      "1 FAMC @F1@",
      "1 FAMC @F1@",
      "0 @F1@ FAM",
      "1 CHIL @I3@",
      "1 CHIL @I404@",
    ),
  );
  const f = families.find((x) => x.id === "@F1@")!;
  expect(f.husband).toBe("@I2@");
  expect(f.children.sort()).toEqual(["@I1@", "@I3@"]);
  expect(people.find((p) => p.id === "@I3@")!.fams).toEqual([]);
  expect(people.find((p) => p.id === "@I3@")!.famc).toEqual(["@F1@"]);
});
