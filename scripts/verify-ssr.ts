import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

class ServerImportVerifier {
  async verify(): Promise<void> {
    const module: unknown = await import(pathToFileURL("dist/api.js").href);
    assert.ok(module && typeof module === "object");
    assert.deepEqual(Object.keys(module as Record<string, unknown>).sort(), [
      "ReferenceEquality",
      "SirenReactError",
      "SirenReactIssue",
      "SirenReactIssues",
      "SirenSessionProvider",
      "UiDispatcher",
      "useSirenDispatch",
      "useSirenSelector",
      "useSirenSnapshot",
    ]);

    const interactions: unknown = await import(
      pathToFileURL("dist/interactions.js").href
    );
    assert.ok(interactions && typeof interactions === "object");
    assert.ok(Object.hasOwn(interactions, "InteractionTree"));
    for (const surface of [
      "CommandBar",
      "CommandDial",
      "CommandMenu",
      "CommandPalette",
      "CommandRail",
      "CommandSheet",
      "ContextMenu",
    ]) {
      assert.ok(Object.hasOwn(interactions, surface));
    }

    const extensions: unknown = await import(
      pathToFileURL("dist/extensions.js").href
    );
    assert.ok(extensions && typeof extensions === "object");
    assert.ok(Object.hasOwn(extensions, "StandardSurfacePolicy"));
    assert.ok(Object.hasOwn(extensions, "StandardIconRegistry"));
    assert.ok(Object.hasOwn(extensions, "StandardSirenTheme"));
  }
}

await new ServerImportVerifier().verify();
