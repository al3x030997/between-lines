// Shared Thema-based literary vocabulary loader (TS).
// YAML source-of-truth lives at packages/canon/yaml/, resolved relative to this file.
// Internal monorepo package only.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { load as parseYaml } from "js-yaml";

const here = dirname(fileURLToPath(import.meta.url));
export const CANON_DIR: string = resolve(here, "..", "..", "yaml");

export type CanonName =
  | "aliases"
  | "extensions"
  | "hard_nos"
  | "thema_subjects"
  | "thema_audience"
  | "thema_form";

export function load(name: CanonName): unknown {
  const path = resolve(CANON_DIR, `${name}.yaml`);
  return parseYaml(readFileSync(path, "utf8"));
}

export function version(): string {
  return readFileSync(resolve(CANON_DIR, "VERSION"), "utf8").trim();
}
