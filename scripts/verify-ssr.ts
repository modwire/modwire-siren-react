import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

class ServerImportVerifier {
  async verify(): Promise<void> {
    const module: unknown = await import(pathToFileURL("dist/api.js").href);
    assert.ok(module && typeof module === "object");
    assert.deepEqual(Object.keys(module as Record<string, unknown>).sort(), [
      "ReferenceEquality",
      "SirenReactError",
      "SirenSessionProvider",
      "UiDispatcher",
      "useSirenDispatch",
      "useSirenSelector",
      "useSirenSnapshot",
    ]);
  }
}

await new ServerImportVerifier().verify();
