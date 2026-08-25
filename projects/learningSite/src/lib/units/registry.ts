export type Dimension = {
  mass: number;
  length: number;
  time: number;
  current: number;
  temperature: number;
  amount: number;
  luminousIntensity: number;
};

const ZERO_DIMENSION: Dimension = {
  mass: 0,
  length: 0,
  time: 0,
  current: 0,
  temperature: 0,
  amount: 0,
  luminousIntensity: 0,
};

function dim(partial: Partial<Dimension>): Dimension {
  return { ...ZERO_DIMENSION, ...partial };
}

/** Symbols stay canonical (SI notation) across locales — only the display name is localised. */
export type UnitDefinition = {
  symbol: string;
  name: { en: string; et: string };
  dimension: Dimension;
  /** Multiply a value in this unit by `toBase` to get the coherent SI value for its dimension. */
  toBase: number;
};

export const unitRegistry: Record<string, UnitDefinition> = {
  kg: { symbol: "kg", name: { en: "kilogram", et: "kilogramm" }, dimension: dim({ mass: 1 }), toBase: 1 },
  g: { symbol: "g", name: { en: "gram", et: "gramm" }, dimension: dim({ mass: 1 }), toBase: 0.001 },
  m: { symbol: "m", name: { en: "metre", et: "meeter" }, dimension: dim({ length: 1 }), toBase: 1 },
  km: { symbol: "km", name: { en: "kilometre", et: "kilomeeter" }, dimension: dim({ length: 1 }), toBase: 1000 },
  s: { symbol: "s", name: { en: "second", et: "sekund" }, dimension: dim({ time: 1 }), toBase: 1 },
  "m/s": {
    symbol: "m/s",
    name: { en: "metre per second", et: "meeter sekundis" },
    dimension: dim({ length: 1, time: -1 }),
    toBase: 1,
  },
  "m/s^2": {
    symbol: "m/s^2",
    name: { en: "metre per second squared", et: "meeter sekundi kohta ruudus" },
    dimension: dim({ length: 1, time: -2 }),
    toBase: 1,
  },
  N: {
    symbol: "N",
    name: { en: "newton", et: "njuuton" },
    dimension: dim({ mass: 1, length: 1, time: -2 }),
    toBase: 1,
  },
  J: {
    symbol: "J",
    name: { en: "joule", et: "džaul" },
    dimension: dim({ mass: 1, length: 2, time: -2 }),
    toBase: 1,
  },
  "kg*m/s": {
    symbol: "kg*m/s",
    name: { en: "kilogram metre per second", et: "kilogramm meeter sekundis" },
    dimension: dim({ mass: 1, length: 1, time: -1 }),
    toBase: 1,
  },
  K: {
    symbol: "K",
    name: { en: "kelvin", et: "kelvin" },
    dimension: dim({ temperature: 1 }),
    toBase: 1,
  },
  mol: {
    symbol: "mol",
    name: { en: "mole", et: "mool" },
    dimension: dim({ amount: 1 }),
    toBase: 1,
  },
  Pa: {
    symbol: "Pa",
    name: { en: "pascal", et: "paskal" },
    dimension: dim({ mass: 1, length: -1, time: -2 }),
    toBase: 1,
  },
  "m^3": {
    symbol: "m^3",
    name: { en: "cubic metre", et: "kuupmeeter" },
    dimension: dim({ length: 3 }),
    toBase: 1,
  },
  "J/kg": {
    symbol: "J/kg",
    name: { en: "joule per kilogram", et: "džaul kilogrammi kohta" },
    dimension: dim({ length: 2, time: -2 }),
    toBase: 1,
  },
  "J/(kg*K)": {
    symbol: "J/(kg*K)",
    name: { en: "joule per kilogram-kelvin", et: "džaul kilogrammi ja kelvini kohta" },
    dimension: dim({ length: 2, time: -2, temperature: -1 }),
    toBase: 1,
  },
  "1/K": {
    symbol: "1/K",
    name: { en: "per kelvin", et: "kelvini kohta" },
    dimension: dim({ temperature: -1 }),
    toBase: 1,
  },
  "kg/mol": {
    symbol: "kg/mol",
    name: { en: "kilogram per mole", et: "kilogramm mooli kohta" },
    dimension: dim({ mass: 1, amount: -1 }),
    toBase: 1,
  },
  "J/K": {
    symbol: "J/K",
    name: { en: "joule per kelvin", et: "džaul kelvini kohta" },
    dimension: dim({ mass: 1, length: 2, time: -2, temperature: -1 }),
    toBase: 1,
  },
  Hz: {
    symbol: "Hz",
    name: { en: "hertz", et: "herts" },
    dimension: dim({ time: -1 }),
    toBase: 1,
  },
  "N/m": {
    symbol: "N/m",
    name: { en: "newton per metre", et: "njuuton meetri kohta" },
    dimension: dim({ mass: 1, time: -2 }),
    toBase: 1,
  },
  A: {
    symbol: "A",
    name: { en: "ampere", et: "amper" },
    dimension: dim({ current: 1 }),
    toBase: 1,
  },
  V: {
    symbol: "V",
    name: { en: "volt", et: "volt" },
    dimension: dim({ mass: 1, length: 2, time: -3, current: -1 }),
    toBase: 1,
  },
  ohm: {
    symbol: "ohm",
    name: { en: "ohm", et: "oom" },
    dimension: dim({ mass: 1, length: 2, time: -3, current: -2 }),
    toBase: 1,
  },
  C: {
    symbol: "C",
    name: { en: "coulomb", et: "kulon" },
    dimension: dim({ current: 1, time: 1 }),
    toBase: 1,
  },
  T: {
    symbol: "T",
    name: { en: "tesla", et: "tesla" },
    dimension: dim({ mass: 1, time: -2, current: -1 }),
    toBase: 1,
  },
  F: {
    symbol: "F",
    name: { en: "farad", et: "farad" },
    dimension: dim({ mass: -1, length: -2, time: 4, current: 2 }),
    toBase: 1,
  },
  "N/C": {
    symbol: "N/C",
    name: { en: "newton per coulomb", et: "njuuton kuloni kohta" },
    dimension: dim({ mass: 1, length: 1, time: -3, current: -1 }),
    toBase: 1,
  },
  "1": {
    symbol: "1",
    name: { en: "dimensionless", et: "mõõtühikuta" },
    dimension: dim({}),
    toBase: 1,
  },
  deg: {
    symbol: "deg",
    name: { en: "degree", et: "kraad" },
    dimension: dim({}),
    toBase: 1,
  },
  "W/m^2": {
    symbol: "W/m^2",
    name: { en: "watt per square metre", et: "vatt ruutmeetri kohta" },
    dimension: dim({ mass: 1, time: -3 }),
    toBase: 1,
  },
  eV: {
    symbol: "eV",
    name: { en: "electronvolt", et: "elektronvolt" },
    dimension: dim({ mass: 1, length: 2, time: -2 }),
    toBase: 1.602176634e-19,
  },
  "m^2": {
    symbol: "m^2",
    name: { en: "square metre", et: "ruutmeeter" },
    dimension: dim({ length: 2 }),
    toBase: 1,
  },
  "kg/m^3": {
    symbol: "kg/m^3",
    name: { en: "kilogram per cubic metre", et: "kilogramm kuupmeetri kohta" },
    dimension: dim({ mass: 1, length: -3 }),
    toBase: 1,
  },
  nm: {
    symbol: "nm",
    name: { en: "nanometre", et: "nanomeeter" },
    dimension: dim({ length: 1 }),
    toBase: 1e-9,
  },
  "N*m": {
    symbol: "N*m",
    name: { en: "newton-metre", et: "njuutonmeeter" },
    dimension: dim({ mass: 1, length: 2, time: -2 }),
    toBase: 1,
  },
  "kg*m^2": {
    symbol: "kg*m^2",
    name: { en: "kilogram square metre", et: "kilogramm-ruutmeeter" },
    dimension: dim({ mass: 1, length: 2 }),
    toBase: 1,
  },
  "rad/s": {
    symbol: "rad/s",
    name: { en: "radian per second", et: "radiaan sekundis" },
    dimension: dim({ time: -1 }),
    toBase: 1,
  },
  "rad/s^2": {
    symbol: "rad/s^2",
    name: { en: "radian per second squared", et: "radiaan sekundi kohta ruudus" },
    dimension: dim({ time: -2 }),
    toBase: 1,
  },
  W: {
    symbol: "W",
    name: { en: "watt", et: "vatt" },
    dimension: dim({ mass: 1, length: 2, time: -3 }),
    toBase: 1,
  },
  H: {
    symbol: "H",
    name: { en: "henry", et: "henri" },
    dimension: dim({ mass: 1, length: 2, time: -2, current: -2 }),
    toBase: 1,
  },
  "N*m^2/C^2": {
    symbol: "N*m^2/C^2",
    name: { en: "newton-square-metre per square coulomb", et: "njuutonruutmeeter ruutkuloni kohta" },
    dimension: dim({ mass: 1, length: 3, time: -4, current: -2 }),
    toBase: 1,
  },
  "ohm*m": {
    symbol: "ohm*m",
    name: { en: "ohm-metre", et: "oommeeter" },
    dimension: dim({ mass: 1, length: 3, time: -3, current: -2 }),
    toBase: 1,
  },
  "T*m/A": {
    symbol: "T*m/A",
    name: { en: "tesla-metre per ampere", et: "tesla-meeter ampri kohta" },
    dimension: dim({ mass: 1, length: 1, time: -2, current: -2 }),
    toBase: 1,
  },
};

export function getUnit(symbol: string): UnitDefinition {
  const unit = unitRegistry[symbol];
  if (!unit) throw new Error(`Unknown unit symbol: ${symbol}`);
  return unit;
}

export function formatUnitName(symbol: string, locale: "en" | "et"): string {
  return getUnit(symbol).name[locale];
}

export function dimensionsEqual(a: Dimension, b: Dimension): boolean {
  return (Object.keys(a) as (keyof Dimension)[]).every((key) => a[key] === b[key]);
}

export function areUnitsEquivalent(a: string, b: string): boolean {
  return dimensionsEqual(getUnit(a).dimension, getUnit(b).dimension);
}

export function convert(value: number, from: string, to: string): number {
  const fromUnit = getUnit(from);
  const toUnit = getUnit(to);
  if (!dimensionsEqual(fromUnit.dimension, toUnit.dimension)) {
    throw new Error(`Cannot convert ${from} to ${to}: dimension mismatch`);
  }
  return (value * fromUnit.toBase) / toUnit.toBase;
}
