import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

class ServerImportVerifier {
  async verify(): Promise<void> {
    const module: unknown = await import(pathToFileURL("dist/api.js").href);
    assert.ok(module && typeof module === "object");
    assert.deepEqual(Object.keys(module as Record<string, unknown>).sort(), [
      "FrameFamily",
      "ReferenceEquality",
      "SirenApplication",
      "SirenReactCode",
      "SirenReactError",
      "SirenReactIssue",
      "SirenReactIssues",
      "SirenReactOptions",
      "SirenSessionProvider",
      "StandardSirenReactOptions",
      "UiDispatcher",
      "useSirenDispatch",
      "useSirenSelector",
      "useSirenSnapshot",
    ]);

    const frames: unknown = await import(pathToFileURL("dist/frames.js").href);
    assert.ok(frames && typeof frames === "object");
    for (const frame of [
      "FlowFrame",
      "FocusFrame",
      "PocketFrame",
      "WorkbenchFrame",
    ]) {
      assert.ok(Object.hasOwn(frames, frame));
    }

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
    assert.ok(Object.hasOwn(extensions, "StandardWidgetRegistry"));

    const widgets: unknown = await import(
      pathToFileURL("dist/widgets.js").href
    );
    assert.ok(widgets && typeof widgets === "object");
    for (const widget of [
      "AcknowledgementWidget",
      "ActionWidget",
      "ConfirmationWidget",
      "DiagnosticWidget",
      "DocumentWidget",
      "FieldWidget",
      "ProgressWidget",
      "PropertyWidget",
      "RegionWidget",
      "RelationWidget",
      "UnsupportedWidget",
    ]) {
      assert.ok(Object.hasOwn(widgets, widget));
    }
  }
}

await new ServerImportVerifier().verify();
