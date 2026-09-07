import type { Season } from "./types";

// seasons.json is hand-edited as often as it is written by code, so it keeps a
// deliberate shape: one match, rest or standings row per line, everything else
// indented normally. Both the standings importer and the admin write through
// here, so an automated edit shows up as a few changed lines rather than a
// whole-file reformat that buries what actually changed.
const BLOCK_KEYS = new Set(["matches", "rests", "standings"]);

function compact(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(compact).join(", ")}]`;
  if (value && typeof value === "object") {
    const body = Object.entries(value)
      .map(([k, v]) => `${JSON.stringify(k)}: ${compact(v)}`)
      .join(", ");
    return `{ ${body} }`;
  }
  return JSON.stringify(value);
}

export function serializeSeasons(seasons: Season[]): string {
  const out: string[] = ["["];
  seasons.forEach((season, i) => {
    out.push("  {");
    out.push(
      Object.entries(season)
        .map(([key, value]) => {
          const name = JSON.stringify(key);
          if (BLOCK_KEYS.has(key) && Array.isArray(value) && value.length > 0) {
            return [
              `    ${name}: [`,
              ...value.map((item, j) => `      ${compact(item)}${j < value.length - 1 ? "," : ""}`),
              "    ]",
            ].join("\n");
          }
          return `    ${name}: ${compact(value)}`;
        })
        .join(",\n"),
    );
    out.push(`  }${i < seasons.length - 1 ? "," : ""}`);
  });
  out.push("]");
  return `${out.join("\n")}\n`;
}
