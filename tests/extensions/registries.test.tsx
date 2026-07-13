import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  FrameFamily,
  SirenApplication,
  SirenReactCode,
} from "@modwire/siren-react";
import {
  ComponentReference,
  ElementIconFactory,
  IconRegistryBuilder,
  WidgetRegistryBuilder,
} from "@modwire/siren-react/extensions";
import { IconReference } from "@modwire/siren-react/interactions";

import { DocumentCase } from "../support/documents";
import { OptionsCase } from "../support/options";
import { RecordingRendererObserver } from "../support/observer";
import { SessionCase } from "../support/sessions";
import { ThrowingWidgetFactory } from "../support/throwing-widget";

describe("local extension registries", () => {
  it("rejects duplicate widget registrations deterministically", () => {
    const reference = new ComponentReference("duplicate");
    const factory = new ThrowingWidgetFactory();
    const builder = new WidgetRegistryBuilder().register(reference, factory);
    expect(() => builder.register(reference, factory)).toThrow(
      expect.objectContaining({ kind: SirenReactCode.widgetDuplicate }),
    );
  });

  it("rejects duplicate icon registrations deterministically", () => {
    const reference = new IconReference("duplicate");
    const factory = new ElementIconFactory(<span>icon</span>);
    const builder = new IconRegistryBuilder().register(reference, factory);
    expect(() => builder.register(reference, factory)).toThrow(
      expect.objectContaining({ kind: SirenReactCode.iconDuplicate }),
    );
  });

  it("uses and reports the local unknown-icon fallback", async () => {
    const observer = new RecordingRendererObserver();
    const fallback = new ElementIconFactory(
      <span aria-label="Unknown command icon">?</span>,
    );
    const icons = new IconRegistryBuilder().build(fallback, observer);
    const opened = new SessionCase().open(
      new DocumentCase().commands(["Alpha"]),
    );
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new OptionsCase().icons(icons, observer)}
        session={opened.session}
      />,
    );
    expect(screen.getByLabelText("Unknown command icon")).toBeTruthy();
    await waitFor(() => {
      expect(observer.failures.length).toBeGreaterThan(0);
    });
    expect(observer.failures[0]).toMatchObject({
      kind: SirenReactCode.iconUnknown,
    });
  });

  it("contains renderer exceptions and shows the semantic fallback", async () => {
    const observer = new RecordingRendererObserver();
    const widgets = new WidgetRegistryBuilder().build(
      new ThrowingWidgetFactory(),
    );
    const opened = new SessionCase().open(new DocumentCase().actionable());
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new OptionsCase().widgets(widgets, observer)}
        session={opened.session}
      />,
    );
    expect(await screen.findByRole("status")).toBeTruthy();
    expect(document.body.textContent).not.toContain("private-renderer-detail");
    await waitFor(() => {
      expect(observer.failures).toHaveLength(1);
    });
    expect(observer.failures[0]).toMatchObject({
      kind: SirenReactCode.rendererFailure,
      message: "Widget renderer failed",
    });
  });
});
