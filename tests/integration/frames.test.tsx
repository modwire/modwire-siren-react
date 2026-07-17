import { render, screen } from "@testing-library/react";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import {
  FrameFamily,
  SirenApplication,
  StandardSirenReactOptions,
} from "@modwire/siren-react";

import { DocumentCase } from "../support/documents";
import { SessionCase } from "../support/sessions";

describe("application frames", () => {
  const frames = [
    FrameFamily.focus,
    FrameFamily.workbench,
    FrameFamily.flow,
    FrameFamily.pocket,
  ];

  it.each(frames)("renders the %s frame through the root facade", (frame) => {
    const opened = new SessionCase().open(new DocumentCase().actionable());
    render(
      <SirenApplication
        frame={frame}
        options={new StandardSirenReactOptions().create()}
        session={opened.session}
      />,
    );
    expect(screen.getByLabelText("Siren application")).toBeTruthy();
    expect(
      screen.getByRole("heading", { level: 1, name: "Record" }),
    ).toBeTruthy();
  });

  it("produces server markup without a browser subscription", () => {
    const opened = new SessionCase().open(new DocumentCase().actionable());
    const markup = renderToString(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new StandardSirenReactOptions().create()}
        session={opened.session}
      />,
    );
    expect(markup).toContain('aria-label="Siren application"');
    expect(markup).toContain("Save record");
  });

  it("publishes MUI light and dark color schemes for system adaptation", () => {
    const opened = new SessionCase().open(new DocumentCase().actionable());
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new StandardSirenReactOptions().create()}
        session={opened.session}
      />,
    );
    const rules = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules))
      .map((rule) => rule.cssText)
      .join("\n");
    expect(rules).toContain("--mui-palette-background-default");
    expect(rules).toContain("prefers-color-scheme: dark");
  });

  it("hydrates the server snapshot without replacing the castle", async () => {
    const opened = new SessionCase().open(new DocumentCase().actionable());
    const options = new StandardSirenReactOptions().create();
    const application = (
      <SirenApplication
        frame={FrameFamily.focus}
        options={options}
        session={opened.session}
      />
    );
    const container = document.createElement("div");
    container.innerHTML = renderToString(application);
    document.body.append(container);
    const before = container.firstElementChild;
    const errors = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const root = hydrateRoot(container, application);
    await act(async () => {
      await Promise.resolve();
    });
    expect(container.firstElementChild).toBe(before);
    expect(errors).not.toHaveBeenCalled();
    await act(async () => {
      root.unmount();
      await Promise.resolve();
    });
    container.remove();
  });
});
