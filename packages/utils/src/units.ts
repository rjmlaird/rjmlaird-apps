export interface Unit {
  id: string;
  name: string;
  symbol: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export interface UnitCategory {
  id: string;
  name: string;
  base: string;
  units: Unit[];
}

const linear = (id: string, name: string, symbol: string, factor: number): Unit => ({
  id,
  name,
  symbol,
  toBase: (v) => v * factor,
  fromBase: (v) => v / factor,
});

// Constants (SI / IAU nominal values)
const AU = 149_597_870_700; // m
const LY = 9_460_730_472_580_800; // m
const PC = (648_000 / Math.PI) * AU; // m
const YEAR = 31_557_600; // s (Julian year)

export const CATEGORIES: UnitCategory[] = [
  {
    id: "length",
    name: "Length / distance",
    base: "m",
    units: [
      linear("m", "metre", "m", 1),
      linear("km", "kilometre", "km", 1e3),
      linear("cm", "centimetre", "cm", 1e-2),
      linear("mm", "millimetre", "mm", 1e-3),
      linear("um", "micrometre", "µm", 1e-6),
      linear("nm", "nanometre", "nm", 1e-9),
      linear("angstrom", "ångström", "Å", 1e-10),
      linear("in", "inch", "in", 0.0254),
      linear("ft", "foot", "ft", 0.3048),
      linear("yd", "yard", "yd", 0.9144),
      linear("mi", "mile", "mi", 1609.344),
      linear("nmi", "nautical mile", "nmi", 1852),
      linear("r_earth", "Earth radius (mean)", "R⊕", 6_371_000),
      linear("r_sun", "solar radius", "R☉", 6.957e8),
      linear("au", "astronomical unit", "AU", AU),
      linear("ly", "light-year", "ly", LY),
      linear("pc", "parsec", "pc", PC),
      linear("kpc", "kiloparsec", "kpc", PC * 1e3),
      linear("mpc", "megaparsec", "Mpc", PC * 1e6),
    ],
  },
  {
    id: "mass",
    name: "Mass",
    base: "kg",
    units: [
      linear("kg", "kilogram", "kg", 1),
      linear("g", "gram", "g", 1e-3),
      linear("mg", "milligram", "mg", 1e-6),
      linear("t", "tonne", "t", 1e3),
      linear("lb", "pound", "lb", 0.45359237),
      linear("oz", "ounce", "oz", 0.028349523125),
      linear("m_earth", "Earth mass", "M⊕", 5.9722e24),
      linear("m_jup", "Jupiter mass", "MJ", 1.89813e27),
      linear("m_sun", "solar mass", "M☉", 1.98847e30),
    ],
  },
  {
    id: "time",
    name: "Time",
    base: "s",
    units: [
      linear("s", "second", "s", 1),
      linear("ms", "millisecond", "ms", 1e-3),
      linear("us", "microsecond", "µs", 1e-6),
      linear("ns", "nanosecond", "ns", 1e-9),
      linear("min", "minute", "min", 60),
      linear("h", "hour", "h", 3600),
      linear("d", "day", "d", 86_400),
      linear("wk", "week", "wk", 604_800),
      linear("yr", "Julian year", "yr", YEAR),
      linear("myr", "million years", "Myr", YEAR * 1e6),
      linear("gyr", "billion years", "Gyr", YEAR * 1e9),
    ],
  },
  {
    id: "speed",
    name: "Speed",
    base: "m/s",
    units: [
      linear("m_s", "metre/second", "m/s", 1),
      linear("km_h", "kilometre/hour", "km/h", 1 / 3.6),
      linear("mph", "mile/hour", "mph", 0.44704),
      linear("kn", "knot", "kn", 1852 / 3600),
      linear("ft_s", "foot/second", "ft/s", 0.3048),
      linear("km_s", "kilometre/second", "km/s", 1e3),
      linear("c", "speed of light", "c", 299_792_458),
    ],
  },
  {
    id: "force",
    name: "Force",
    base: "N",
    units: [
      linear("n", "newton", "N", 1),
      linear("kn_f", "kilonewton", "kN", 1e3),
      linear("lbf", "pound-force", "lbf", 4.4482216152605),
      linear("kgf", "kilogram-force", "kgf", 9.80665),
      linear("dyn", "dyne", "dyn", 1e-5),
    ],
  },
  {
    id: "pressure",
    name: "Pressure",
    base: "Pa",
    units: [
      linear("pa", "pascal", "Pa", 1),
      linear("kpa", "kilopascal", "kPa", 1e3),
      linear("mpa", "megapascal", "MPa", 1e6),
      linear("bar", "bar", "bar", 1e5),
      linear("mbar", "millibar", "mbar", 100),
      linear("atm", "standard atmosphere", "atm", 101_325),
      linear("psi", "pound/sq inch", "psi", 6894.757293168),
      linear("torr", "torr", "Torr", 101_325 / 760),
      linear("mmhg", "millimetre of mercury", "mmHg", 133.322387415),
    ],
  },
  {
    id: "energy",
    name: "Energy",
    base: "J",
    units: [
      linear("j", "joule", "J", 1),
      linear("kj", "kilojoule", "kJ", 1e3),
      linear("mj", "megajoule", "MJ", 1e6),
      linear("wh", "watt-hour", "Wh", 3600),
      linear("kwh", "kilowatt-hour", "kWh", 3.6e6),
      linear("cal", "calorie (thermochemical)", "cal", 4.184),
      linear("kcal", "kilocalorie", "kcal", 4184),
      linear("btu", "British thermal unit", "BTU", 1055.05585262),
      linear("ev", "electronvolt", "eV", 1.602176634e-19),
      linear("kev", "kiloelectronvolt", "keV", 1.602176634e-16),
      linear("mev", "megaelectronvolt", "MeV", 1.602176634e-13),
      linear("erg", "erg", "erg", 1e-7),
    ],
  },
  {
    id: "power",
    name: "Power",
    base: "W",
    units: [
      linear("w", "watt", "W", 1),
      linear("kw", "kilowatt", "kW", 1e3),
      linear("mw", "megawatt", "MW", 1e6),
      linear("hp", "horsepower (mechanical)", "hp", 745.69987158227),
      linear("l_sun", "solar luminosity", "L☉", 3.828e26),
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    base: "K",
    units: [
      linear("k", "kelvin", "K", 1),
      {
        id: "c",
        name: "degree Celsius",
        symbol: "°C",
        toBase: (v) => v + 273.15,
        fromBase: (v) => v - 273.15,
      },
      {
        id: "f",
        name: "degree Fahrenheit",
        symbol: "°F",
        toBase: (v) => ((v - 32) * 5) / 9 + 273.15,
        fromBase: (v) => ((v - 273.15) * 9) / 5 + 32,
      },
      linear("r", "degree Rankine", "°R", 5 / 9),
    ],
  },
  {
    id: "angle",
    name: "Angle",
    base: "rad",
    units: [
      linear("rad", "radian", "rad", 1),
      linear("deg", "degree", "°", Math.PI / 180),
      linear("arcmin", "arcminute", "′", Math.PI / 10_800),
      linear("arcsec", "arcsecond", "″", Math.PI / 648_000),
      linear("mas", "milliarcsecond", "mas", Math.PI / 648_000_000),
      linear("rev", "revolution", "rev", 2 * Math.PI),
    ],
  },
];

export interface ConvertResult {
  category: string;
  from: string;
  to: string;
  input: number;
  result: number;
}

/** Convert `value` between two units of the same category. Throws on unknown ids. */
export function convertUnits(
  categoryId: string,
  from: string,
  to: string,
  value: number,
): ConvertResult {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) throw new Error(`Unknown category "${categoryId}"`);
  const f = cat.units.find((u) => u.id === from);
  const t = cat.units.find((u) => u.id === to);
  if (!f) throw new Error(`Unknown unit "${from}" in ${categoryId}`);
  if (!t) throw new Error(`Unknown unit "${to}" in ${categoryId}`);
  return {
    category: categoryId,
    from,
    to,
    input: value,
    result: t.fromBase(f.toBase(value)),
  };
}
