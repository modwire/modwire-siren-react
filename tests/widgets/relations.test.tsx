import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  FrameFamily,
  SirenApplication,
  StandardSirenReactOptions,
} from "@modwire/siren-react";

import { PendingResponse } from "../support/client/pending";
import { DocumentCase } from "../support/documents";
import { SessionCase } from "../support/sessions";

describe("semantic relation widgets", () => {
  it("exposes loading, prevents re-entry, and renders the loaded document", async () => {
    const user = userEvent.setup();
    const documents = new DocumentCase();
    const pending = new PendingResponse();
    const opened = new SessionCase().open(documents.related(), [
      pending.promise,
    ]);
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new StandardSirenReactOptions().create()}
        session={opened.session}
      />,
    );
    const relation = screen.getByRole("button", { name: "Next record" });
    await user.click(relation);
    expect(relation.getAttribute("aria-busy")).toBe("true");
    expect(relation).toHaveProperty("disabled", true);
    expect(screen.getByRole("progressbar")).toBeTruthy();
    expect(opened.transport.requests).toHaveLength(1);
    expect(opened.transport.requests[0]).toMatchObject({
      method: "GET",
      url: "https://api.example.test/records/two",
    });
    pending.resolveDocument(
      documents.profiled(
        documents.metadata({
          presentation: { label: "Next castle room", role: "detail" },
        }),
      ),
    );
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Next castle room",
      }),
    ).toBeTruthy();
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).toBeNull();
    });
  });
});
