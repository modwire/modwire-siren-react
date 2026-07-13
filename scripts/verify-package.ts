import { execFileSync } from "node:child_process";

class PackageVerifier {
  static readonly expected = new Set([
    "package/IMPLEMENTATION.md",
    "package/LICENSE",
    "package/README.md",
    "package/dist/api.d.ts",
    "package/dist/api.js",
    "package/dist/api.js.map",
    "package/dist/interactions.d.ts",
    "package/dist/interactions.js",
    "package/dist/interactions.js.map",
    "package/dist/extensions.d.ts",
    "package/dist/extensions.js",
    "package/dist/extensions.js.map",
    "package/package.json",
  ]);

  verify(): void {
    const output = execFileSync(
      "npm",
      ["pack", "--dry-run", "--json", "--ignore-scripts"],
      { encoding: "utf8" },
    );
    const parsed: unknown = JSON.parse(output);
    const actual = new Set(this.paths(parsed));
    const missing = [...PackageVerifier.expected].filter(
      (path) => !actual.has(path),
    );
    const unexpected = [...actual].filter(
      (path) =>
        !PackageVerifier.expected.has(path) &&
        !path.startsWith("package/dist/"),
    );
    if (missing.length > 0 || unexpected.length > 0) {
      throw new Error(
        JSON.stringify({
          missing: missing.sort(),
          unexpected: unexpected.sort(),
        }),
      );
    }
  }

  private paths(value: unknown): string[] {
    if (!Array.isArray(value) || value.length !== 1) {
      throw new Error("npm pack returned an unexpected result");
    }
    const result: unknown = value[0];
    if (!result || typeof result !== "object") {
      throw new Error("npm pack returned an unexpected file manifest");
    }
    const files = (result as Record<string, unknown>).files;
    if (!Array.isArray(files)) {
      throw new Error("npm pack returned an unexpected file manifest");
    }
    return files.map((file: unknown) => {
      if (!file || typeof file !== "object") {
        throw new Error("npm pack returned an invalid file entry");
      }
      const path = (file as Record<string, unknown>).path;
      if (typeof path !== "string") {
        throw new Error("npm pack returned an invalid file entry");
      }
      return `package/${path}`;
    });
  }
}

new PackageVerifier().verify();
