import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const migrationsDir = path.join(import.meta.dirname, "migrations");

/** The newest migration that defines the named constraint. */
function newestMigrationContaining(needle: string): { name: string; sql: string } {
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
  for (const name of [...files].reverse()) {
    const sql = fs.readFileSync(path.join(migrationsDir, name), "utf8");
    if (sql.includes(needle)) return { name, sql };
  }
  throw new Error(`No migration contains ${needle}`);
}

describe("AI provider default constraints", () => {
  it("allows opencode-go in every AI provider check constraint", () => {
    for (const constraint of [
      "ai_provider_defaults_provider_check",
      "ai_connection_defaults_provider_check",
    ]) {
      const { name, sql } = newestMigrationContaining(constraint);
      expect(sql, `${constraint} in ${name}`).toContain("'opencode-go'");
    }
  });
});
