import { en } from "./en";

export type Dictionary = typeof en;

const dictionaries = {
  en,
} satisfies Record<string, Dictionary>;

export type Locale = keyof typeof dictionaries;

type DotPaths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = DotPaths<Dictionary>;

const DEFAULT_LOCALE: Locale = "en";

let currentLocale: Locale = DEFAULT_LOCALE;

export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function t(key: TranslationKey): string {
  let node: unknown = dictionaries[currentLocale];
  for (const segment of key.split(".")) {
    if (typeof node !== "object" || node === null) {
      return key;
    }
    node = (node as Record<string, unknown>)[segment];
  }
  return typeof node === "string" ? node : key;
}
