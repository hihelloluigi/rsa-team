import type { Locale } from "./config";
import { it } from "./it";
import { en } from "./en";

export type { Dictionary } from "./it";

const DICTIONARIES = { it, en } as const;

// Kept apart from server.ts on purpose: that file reads the request's language
// through next/root-params, which only exists inside a server render. Anything
// that already knows its language — a server action, an OG image, a unit test —
// takes its dictionary from here instead.
export const getDictionary = (lang: Locale) => DICTIONARIES[lang];
