import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

describe("published package walls", () => {
  it("loads every declared public entrance", async () => {
    const entrances = [
      "@modwire/siren-react",
      "@modwire/siren-react/extensions",
      "@modwire/siren-react/frames",
      "@modwire/siren-react/interactions",
      "@modwire/siren-react/widgets",
    ];
    for (const entrance of entrances) {
      await expect(import(entrance)).resolves.toBeTypeOf("object");
    }
  });

  it("rejects an undeclared deep import", async () => {
    const forbidden = "@modwire/siren-react/src/runtime/provider";
    await expect(import(forbidden)).rejects.toThrow();
  });

  it("ships declarations and JavaScript without source-bearing maps", () => {
    const api = fileURLToPath(import.meta.resolve("@modwire/siren-react"));
    const files = readdirSync(dirname(api));
    expect(files).toContain("api.js");
    expect(files).toContain("api.d.ts");
    expect(files.some((file) => file.endsWith(".map"))).toBe(false);
    expect(files.some((file) => file.includes(".test."))).toBe(false);
    expect(files.some((file) => file.includes(".spec."))).toBe(false);
    expect(() => readdirSync(join(dirname(api), "src"))).toThrow();
  });
});
