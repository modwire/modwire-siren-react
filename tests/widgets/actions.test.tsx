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
  SirenReactError,
  StandardSirenReactOptions,
} from "@modwire/siren-react";

import { PendingResponse } from "../support/client/pending";
import { ResponseCase } from "../support/client/responses";
import { DocumentCase } from "../support/documents";
import { OptionsCase } from "../support/options";
import { RecordingRendererObserver } from "../support/observer";
import { SessionCase } from "../support/sessions";

describe("semantic action widgets", () => {
  const documents = new DocumentCase();
  const sessions = new SessionCase();

  it("does not submit a required empty draft", async () => {
    const user = userEvent.setup();
    const opened = sessions.open(documents.actionable());
    renderApplication(opened.session);
    const field = screen.getByRole("textbox", { name: /Title/ });
    await user.clear(field);
    await user.click(screen.getByRole("button", { name: "Save record" }));
    expect(opened.transport.requests).toHaveLength(0);
  });

  it("submits the completed composition instead of an intermediate draft", async () => {
    const user = userEvent.setup();
    const response = new ResponseCase().document(documents.actionable());
    const opened = sessions.open(documents.actionable(), [response]);
    renderApplication(opened.session);
    const field = screen.getByRole("textbox", { name: /Title/ });
    fireEvent.compositionStart(field);
    fireEvent.change(field, { target: { value: "東" } });
    fireEvent.change(field, { target: { value: "東京" } });
    fireEvent.compositionEnd(field, { data: "東京" });
    expect((field as HTMLInputElement).value).toBe("東京");
    await user.click(screen.getByRole("button", { name: "Save record" }));
    await waitFor(() => {
      expect(opened.transport.requests).toHaveLength(1);
    });
    expect(opened.transport.requests[0]).toMatchObject({
      body: { title: "東京" },
    });
  });

  it("keeps the draft visible while submitting its current value", async () => {
    const user = userEvent.setup();
    const response = new ResponseCase().document(
      documents.actionable({
        properties: { id: "one", title: "Changed" },
      }),
    );
    const opened = sessions.open(documents.actionable(), [response]);
    renderApplication(opened.session);
    const field = screen.getByRole("textbox", { name: /Title/ });
    await user.clear(field);
    await user.type(field, "Changed");
    expect((field as HTMLInputElement).value).toBe("Changed");
    await user.click(screen.getByRole("button", { name: "Save record" }));
    await waitFor(() => {
      expect(opened.transport.requests).toHaveLength(1);
    });
    expect(opened.transport.requests[0]).toMatchObject({
      body: { title: "Changed" },
      method: "POST",
    });
  });

  it("renders pending state and removes it after completion", async () => {
    const user = userEvent.setup();
    const pending = new PendingResponse();
    const opened = sessions.open(documents.actionable(), [pending.promise]);
    renderApplication(opened.session);
    const field = screen.getByRole("textbox", { name: /Title/ });
    await user.clear(field);
    await user.type(field, "Pending value");
    await user.click(screen.getByRole("button", { name: "Save record" }));
    expect(
      await screen.findByRole("progressbar", {
        name: "Save record in progress",
      }),
    ).toBeTruthy();
    pending.resolveDocument(documents.actionable());
    await waitFor(() => {
      expect(
        screen.queryByRole("progressbar", {
          name: "Save record in progress",
        }),
      ).toBeNull();
    });
  });

  it("cancels confirmation without transport I/O and can recover", async () => {
    const user = userEvent.setup();
    const response = new ResponseCase().document(documents.actionable());
    const opened = sessions.open(documents.confirmable(), [response]);
    renderApplication(opened.session);
    const field = screen.getByRole("textbox", { name: /Title/ });
    await user.clear(field);
    await user.type(field, "Confirmed value");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    const confirmation = await screen.findByRole("group", {
      name: "Confirm Save record",
    });
    await user.click(
      within(confirmation).getByRole("button", { name: "Cancel" }),
    );
    expect(opened.transport.requests).toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    const recovered = await screen.findByRole("group", {
      name: "Confirm Save record",
    });
    await user.type(
      within(recovered).getByRole("textbox", { name: /Acknowledgement/ }),
      "save",
    );
    await user.click(
      within(recovered).getByRole("button", { name: "Confirm" }),
    );
    await waitFor(() => {
      expect(opened.transport.requests).toHaveLength(1);
    });
  });

  it("does not disclose a rejected transport error", async () => {
    const user = userEvent.setup();
    const observer = new RecordingRendererObserver();
    const opened = sessions.open(documents.actionable(), [
      new Error("vault-token-should-never-render"),
    ]);
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new OptionsCase().observer(observer)}
        session={opened.session}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Save record" }));
    await waitFor(() => {
      expect(observer.failures).toHaveLength(1);
    });
    expect(observer.failures[0]).toBeInstanceOf(SirenReactError);
    expect(observer.failures[0]).toMatchObject({
      kind: SirenReactCode.rendererFailure,
      message: "Widget activation failed",
    });
    expect(document.body.textContent).not.toContain("vault-token");
  });

  it("uses the browser password contract for secret fields", () => {
    const source = documents.passwordAction();
    const opened = sessions.open(source);
    renderApplication(opened.session);
    const field = screen.getByLabelText(/Title/);
    expect(field).toHaveProperty("type", "password");
    expect(document.body.textContent).not.toContain("secret-value");
  });
});

function renderApplication(
  session: Parameters<typeof SirenApplication>[0]["session"],
): void {
  render(
    <SirenApplication
      frame={FrameFamily.focus}
      options={new StandardSirenReactOptions().create()}
      session={session}
    />,
  );
}
