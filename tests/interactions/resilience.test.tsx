import { act } from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  FrameFamily,
  SirenApplication,
  StandardSirenReactOptions,
} from "@modwire/siren-react";
import {
  InteractionSurface,
  LayoutDirection,
  PreferredSurface,
  SirenTheme,
  StandardSirenTheme,
} from "@modwire/siren-react/extensions";

import { DocumentCase } from "../support/documents";
import { OptionsCase } from "../support/options";
import { SessionCase } from "../support/sessions";

describe("interaction interruption and environment changes", () => {
  const documents = new DocumentCase();

  afterEach(() => {
    vi.useRealTimers();
  });

  it("handles repeated typeahead, timeout reset, and no match", async () => {
    const user = userEvent.setup();
    renderMenu(documents.commands(["Alpha", "Beta", "Bravo"]));
    await user.click(screen.getByRole("button", { name: "Commands" }));
    const root = await screen.findByRole("menu", { name: "Record" });
    await user.click(within(root).getByRole("menuitem", { name: "Other" }));
    const menu = await screen.findByRole("menu", { name: "Other" });
    vi.useFakeTimers();
    fireEvent.keyDown(menu, { key: "b" });
    await flush();
    expect(document.activeElement).toBe(
      within(menu).getByRole("menuitem", { name: "Beta" }),
    );
    fireEvent.keyDown(menu, { key: "b" });
    await flush();
    expect(document.activeElement).toBe(
      within(menu).getByRole("menuitem", { name: "Bravo" }),
    );
    await act(async () => {
      vi.advanceTimersByTime(701);
      await Promise.resolve();
    });
    fireEvent.keyDown(menu, { key: "b" });
    await flush();
    expect(document.activeElement).toBe(
      within(menu).getByRole("menuitem", { name: "Beta" }),
    );
    fireEvent.keyDown(menu, { key: "x" });
    await flush();
    expect(document.activeElement).toBe(
      within(menu).getByRole("menuitem", { name: "Beta" }),
    );
  });

  it("cancels hover intent before its timer and follows rapid sibling travel", async () => {
    const user = userEvent.setup();
    renderMenu(documents.groupedCommands());
    await user.click(screen.getByRole("button", { name: "Commands" }));
    const root = await screen.findByRole("menu", { name: "Record" });
    const first = within(root).getByRole("menuitem", { name: "First group" });
    const second = within(root).getByRole("menuitem", { name: "Second group" });
    vi.useFakeTimers();
    fireEvent.mouseEnter(first);
    fireEvent.mouseLeave(first);
    await act(async () => {
      vi.advanceTimersByTime(221);
      await Promise.resolve();
    });
    expect(screen.queryByRole("menu", { name: "First group" })).toBeNull();
    fireEvent.mouseEnter(first);
    fireEvent.mouseLeave(first);
    fireEvent.mouseEnter(second);
    await act(async () => {
      vi.advanceTimersByTime(221);
      await Promise.resolve();
    });
    expect(screen.queryByRole("menu", { name: "First group" })).toBeNull();
    expect(screen.getByRole("menu", { name: "Second group" })).toBeTruthy();
  });

  it("switches touch and keyboard surfaces from browser modality", async () => {
    const opened = new SessionCase().open(documents.commands(["Alpha"]));
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new StandardSirenReactOptions().create()}
        session={opened.session}
      />,
    );
    expect(
      screen
        .getByRole("button", { name: "Commands" })
        .getAttribute("aria-haspopup"),
    ).toBe("menu");
    fireEvent.touchStart(window);
    await waitFor(() => {
      expect(
        screen
          .getByRole("button", { name: "Commands" })
          .getAttribute("aria-haspopup"),
      ).toBe("dialog");
    });
    fireEvent.keyDown(window, { key: "Tab" });
    await waitFor(() => {
      expect(
        screen
          .getByRole("button", { name: "Commands" })
          .getAttribute("aria-haspopup"),
      ).toBe("menu");
    });
  });

  it("uses the inward arrow for nested RTL keyboard travel", async () => {
    const user = userEvent.setup();
    const standard = new StandardSirenTheme().create();
    const rtl = new SirenTheme(
      standard.metrics,
      standard.motion,
      standard.colors,
      LayoutDirection.rightToLeft,
    );
    const opened = new SessionCase().open(documents.commands(["Alpha"]));
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new OptionsCase().theme(rtl)}
        session={opened.session}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Commands" }));
    const root = await screen.findByRole("menu", { name: "Record" });
    const group = within(root).getByRole("menuitem", { name: "Other" });
    group.focus();
    fireEvent.keyDown(root, { key: "ArrowLeft" });
    expect(await screen.findByRole("menu", { name: "Other" })).toBeTruthy();
  });

  it("emits reduced-motion and forced-color browser rules", () => {
    const opened = new SessionCase().open(documents.commands(["Alpha"]));
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new StandardSirenReactOptions().create()}
        session={opened.session}
      />,
    );
    const styles = [...document.querySelectorAll("style")]
      .map((style) => style.textContent)
      .join("\n");
    expect(styles).toContain("prefers-reduced-motion");
    expect(styles).toContain("forced-colors");
  });

  function renderMenu(source: ReturnType<DocumentCase["root"]>): void {
    const opened = new SessionCase().open(source);
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new OptionsCase().preference(
          new PreferredSurface(InteractionSurface.menu),
        )}
        session={opened.session}
      />,
    );
  }

  async function flush(): Promise<void> {
    await act(async () => {
      await Promise.resolve();
    });
  }
});
