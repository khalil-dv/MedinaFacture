/**
 * Formatage des montants et dates.
 * FCFA : devise sans centimes -> entiers partout, séparateur de milliers (espace).
 */

const CURRENCY_LABELS: Record<string, string> = {
  XOF: "FCFA",
  XAF: "FCFA",
  GNF: "GNF",
  CDF: "CDF",
  MAD: "MAD",
  EUR: "EUR",
  USD: "USD",
  AED: "AED",
  AFN: "AFN",
  ALL: "ALL",
  AMD: "AMD",
  AOA: "Kwanza",
  ARS: "ARS",
  AUD: "AUD",
  AZN: "AZN",
  BAM: "BAM",
  BBD: "BBD",
  BDT: "BDT",
  BGN: "BGN",
  BHD: "BHD",
  BIF: "BIF",
  BND: "BND",
  BOB: "BOB",
  BRL: "BRL",
  BSD: "BSD",
  BTN: "BTN",
  BWP: "BWP",
  BYN: "BYN",
  BZD: "BZD",
  CAD: "CAD",
  CHF: "CHF",
  CLP: "CLP",
  CNY: "CNY",
  COP: "COP",
  CRC: "CRC",
  CUP: "CUP",
  CVE: "CVE",
  CZK: "CZK",
  DJF: "DJF",
  DKK: "DKK",
  DOP: "DOP",
  DZD: "DZD",
  EGP: "EGP",
  ERN: "ERN",
  ETB: "ETB",
  FJD: "FJD",
  GBP: "GBP",
  GEL: "GEL",
  GHS: "GHS",
  GMD: "GMD",
  GTQ: "GTQ",
  GYD: "GYD",
  HKD: "HKD",
  HNL: "HNL",
  HTG: "HTG",
  HUF: "HUF",
  IDR: "IDR",
  ILS: "ILS",
  INR: "INR",
  IQD: "IQD",
  IRR: "IRR",
  ISK: "ISK",
  JMD: "JMD",
  JOD: "JOD",
  JPY: "JPY",
  KES: "KES",
  KGS: "KGS",
  KHR: "KHR",
  KMF: "KMF",
  KPW: "KPW",
  KRW: "KRW",
  KWD: "KWD",
  KZT: "KZT",
  LAK: "LAK",
  LBP: "LBP",
  LKR: "LKR",
  LRD: "LRD",
  LSL: "LSL",
  LYD: "LYD",
  MDL: "MDL",
  MGA: "MGA",
  MKD: "MKD",
  MMK: "MMK",
  MNT: "MNT",
  MOP: "MOP",
  MRU: "MRU",
  MUR: "MUR",
  MVR: "MVR",
  MWK: "MWK",
  MXN: "MXN",
  MYR: "MYR",
  MZN: "MZN",
  NAD: "NAD",
  NGN: "NGN",
  NIO: "NIO",
  NOK: "NOK",
  NPR: "NPR",
  NZD: "NZD",
  OMR: "OMR",
  PAB: "PAB",
  PEN: "PEN",
  PGK: "PGK",
  PHP: "PHP",
  PKR: "PKR",
  PLN: "PLN",
  PYG: "PYG",
  QAR: "QAR",
  RON: "RON",
  RSD: "RSD",
  RUB: "RUB",
  RWF: "RWF",
  SAR: "SAR",
  SBD: "SBD",
  SCR: "SCR",
  SDG: "SDG",
  SEK: "SEK",
  SGD: "SGD",
  SHP: "SHP",
  SLL: "SLL",
  SOS: "SOS",
  SRD: "SRD",
  SSP: "SSP",
  STN: "STN",
  SVC: "SVC",
  SYP: "SYP",
  SZL: "SZL",
  THB: "THB",
  TJS: "TJS",
  TMT: "TMT",
  TND: "TND",
  TOP: "TOP",
  TRY: "TRY",
  TTD: "TTD",
  TWD: "TWD",
  TZS: "TZS",
  UAH: "UAH",
  UGX: "UGX",
  UYU: "UYU",
  UZS: "UZS",
  VES: "VES",
  VND: "VND",
  VUV: "VUV",
  WST: "WST",
  XCD: "XCD",
  YER: "YER",
  ZAR: "ZAR",
  ZMW: "ZMW",
  ZWL: "ZWL",
};

export function currencyLabel(code: string): string {
  return CURRENCY_LABELS[code] ?? code;
}

/** Formate un montant dans la devise souhaitée (défaut : FCFA). */
export function formatMoney(amount: number, currency: string = "XOF"): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    useGrouping: true,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ${currencyLabel(currency)}`;
}

export function formatFCFA(amount: number): string {
  return formatMoney(amount, "XOF");
}

/** Montant compact pour les graphiques : ex. 1 240 K FCFA */
export function formatCompact(amount: number, currency: string = "XOF"): string {
  const k = amount / 1000;
  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 1,
  }).format(k)} K ${currencyLabel(currency)}`;
}

export function formatFCFACompact(amount: number): string {
  return formatCompact(amount, "XOF");
}

/** Parse une date sans décalage de fuseau (ISO "aaaa-mm-jj" = minuit UTC sinon). */
function parseDateInput(date: Date | string): Date | null {
  if (typeof date !== "string") {
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (iso) {
    const d = new Date(
      Number(iso[1]),
      Number(iso[2]) - 1,
      Number(iso[3]),
      12,
      0,
      0,
    );
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Date au format souhaité (défaut : jj/mm/aaaa). */
export function formatDate(
  date: Date | string,
  format: string = "jj/mm/aaaa",
): string {
  const d = parseDateInput(date);
  if (!d) return "—";
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear().toString();
  switch (format) {
    case "mm/jj/aaaa":
      return `${month}/${day}/${year}`;
    case "aaaa-mm-jj":
      return `${year}-${month}-${day}`;
    case "jj.mm.aa":
      return `${day}.${month}.${year.slice(-2)}`;
    default:
      return `${day}/${month}/${year}`;
  }
}

/** Quantité avec 2 décimales max, virgule française */
export function formatQuantity(value: number): string {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(
    value,
  );
}

/** Initiales d'un nom, ex. "Amadou Bâ" -> "AB" */
export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
