import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  FrameFamily,
  SirenApplication,
  SirenReactCode,
} from "@modwire/siren-react";
import {
  InteractionSurface,
  PreferredSurface,
} from "@modwire/siren-react/extensions";

import { PendingResponse } from "../support/client/pending";
import { DocumentCase } from "../support/documents";
import { OptionsCase } from "../support/options";
import { SessionCase } from "../support/sessions";

describe("interaction surfaces", () => {
  const documents = new DocumentCase();
  const sessions = new SessionCase();

  it("dismisses a menu at the keyboard boundary and restores its initiator", async () => {
    const user = userEvent.setup();
    renderSurface(
      documents.commands(["Alpha", "Bravo"]),
      InteractionSurface.menu,
    );
    const trigger = screen.getByRole("button", { name: "Commands" });
    await user.click(trigger);
    const menu = await screen.findByRole("menu", { name: "Record" });
    await user.click(within(menu).getByRole("menuitem", { name: "Other" }));
    const nested = await screen.findByRole("menu", { name: "Other" });
    expect(
      within(nested).getByRole("menuitem", { name: "Alpha" }),
    ).toBeTruthy();
    await user.keyboard("{Escape}");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull();
    });
    expect(document.activeElement).toBe(trigger);
  });

  it("traverses menu edges without escaping the surface", async () => {
    const user = userEvent.setup();
    renderSurface(
      documents.commands(["Alpha", "Bravo", "Charlie"]),
      InteractionSurface.menu,
    );
    await user.click(screen.getByRole("button", { name: "Commands" }));
    const menu = await screen.findByRole("menu", { name: "Record" });
    await user.click(within(menu).getByRole("menuitem", { name: "Other" }));
    const nested = await screen.findByRole("menu", { name: "Other" });
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(
      within(nested).getByRole("menuitem", { name: "Charlie" }),
    );
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(
      within(nested).getByRole("menuitem", { name: "Alpha" }),
    );
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(
      within(nested).getByRole("menuitem", { name: "Alpha" }),
    );
  });

  it("searches ancestry, empty results, and activation through the palette", async () => {
    const user = userEvent.setup();
    const opened = renderSurface(
      documents.nestedCommands(),
      InteractionSurface.palette,
      [new Error("activation observed")],
    );
    await user.click(screen.getByRole("button", { name: "Commands" }));
    const dialog = await screen.findByRole("dialog");
    const search = within(dialog).getByRole("textbox", { name: "Commands" });
    await user.type(search, "brav");
    expect(within(dialog).getByRole("option", { name: /Bravo/ })).toBeTruthy();
    await user.clear(search);
    await user.type(search, "nothing-matches");
    expect(within(dialog).queryAllByRole("option")).toHaveLength(0);
    await user.clear(search);
    await user.type(search, "alpha");
    await user.click(within(dialog).getByRole("option", { name: /Alpha/ }));
    await waitFor(() => {
      expect(opened.transport.requests).toHaveLength(1);
    });
  });

  it("drills into a sheet, returns, and restores root scroll", async () => {
    const user = userEvent.setup();
    renderSurface(documents.nestedCommands(), InteractionSurface.sheet);
    await user.click(screen.getByRole("button", { name: "Commands" }));
    const list = await screen.findByRole("list", { name: "Commands" });
    list.scrollTop = 73;
    fireEvent.scroll(list);
    await user.click(within(list).getByText("Command group"));
    expect(within(list).getByText("Alpha")).toBeTruthy();
    await user.click(within(list).getByRole("button", { name: "Record" }));
    await waitFor(() => {
      expect(list.scrollTop).toBe(73);
    });
  });

  it("does not resurrect an open surface after a late tree replacement", async () => {
    const user = userEvent.setup();
    const pending = new PendingResponse();
    const opened = renderSurface(
      documents.commands(["Alpha", "Bravo"]),
      InteractionSurface.menu,
      [pending.promise],
    );
    await user.click(screen.getByRole("button", { name: "Commands" }));
    const menu = await screen.findByRole("menu", { name: "Record" });
    await user.click(within(menu).getByRole("menuitem", { name: "Other" }));
    const nested = await screen.findByRole("menu", { name: "Other" });
    await user.click(within(nested).getByRole("menuitem", { name: "Alpha" }));
    pending.resolveDocument(documents.commands(["Replacement"]));
    await waitFor(() => {
      expect(opened.transport.requests).toHaveLength(1);
    });
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull();
      expect(screen.getByRole("button", { name: "Commands" })).toBeTruthy();
    });
  });

  it("rejects a speed dial assigned to a nested tree", () => {
    expect(() =>
      renderSurface(documents.nestedCommands(), InteractionSurface.dial),
    ).toThrow(
      expect.objectContaining({ kind: SirenReactCode.interactionSurface }),
    );
  });

  it("rejects a target-requiring surface at a targetless frame entrance", () => {
    expect(() =>
      renderSurface(
        documents.commands(["Alpha"]),
        InteractionSurface.contextMenu,
      ),
    ).toThrow(
      expect.objectContaining({ kind: SirenReactCode.interactionSurface }),
    );
  });

  function renderSurface(
    source: ReturnType<DocumentCase["root"]>,
    surface: InteractionSurface,
    outcomes: Parameters<SessionCase["open"]>[1] = [],
  ): ReturnType<SessionCase["open"]> {
    const opened = sessions.open(source, outcomes);
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new OptionsCase().preference(new PreferredSurface(surface))}
        session={opened.session}
      />,
    );
    return opened;
  }
});
