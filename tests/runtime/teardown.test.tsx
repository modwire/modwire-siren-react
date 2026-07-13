import { act } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FrameFamily, SirenApplication } from "@modwire/siren-react";
import {
  InteractionSurface,
  PreferredSurface,
} from "@modwire/siren-react/extensions";

import { PendingResponse } from "../support/client/pending";
import { DocumentCase } from "../support/documents";
import { OptionsCase } from "../support/options";
import { RecordingRendererObserver } from "../support/observer";
import { SessionCase } from "../support/sessions";

describe("application teardown", () => {
  it("removes an open portalled surface with its application", async () => {
    const user = userEvent.setup();
    const opened = new SessionCase().open(
      new DocumentCase().commands(["Alpha"]),
    );
    const mounted = render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new OptionsCase().preference(
          new PreferredSurface(InteractionSurface.menu),
        )}
        session={opened.session}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Commands" }));
    const root = await screen.findByRole("menu", { name: "Record" });
    await user.click(within(root).getByRole("menuitem", { name: "Other" }));
    expect(await screen.findByRole("menu", { name: "Other" })).toBeTruthy();
    mounted.unmount();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("ignores a pending completion after unmount and session closure", async () => {
    const user = userEvent.setup();
    const documents = new DocumentCase();
    const pending = new PendingResponse();
    const observer = new RecordingRendererObserver();
    const opened = new SessionCase().open(documents.related(), [
      pending.promise,
    ]);
    const errors = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const mounted = render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new OptionsCase().observer(observer)}
        session={opened.session}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Next record" }));
    expect(await screen.findByRole("progressbar")).toBeTruthy();
    mounted.unmount();
    opened.session.close();
    await act(async () => {
      pending.resolveDocument(documents.actionable());
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(errors).not.toHaveBeenCalled();
    expect(observer.failures).toHaveLength(0);
    errors.mockRestore();
  });
});
