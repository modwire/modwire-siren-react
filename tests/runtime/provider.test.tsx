import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StrictMode } from "react";
import { describe, expect, it } from "vitest";

import {
  FrameFamily,
  SirenApplication,
  SirenReactCode,
  SirenReactError,
  SirenSessionProvider,
  StandardSirenReactOptions,
  useSirenSnapshot,
} from "@modwire/siren-react";

import { DocumentCase } from "../support/documents";
import { OptionsCase } from "../support/options";
import { RecordingRendererObserver } from "../support/observer";
import { SessionCase } from "../support/sessions";

function SnapshotLabel(): React.JSX.Element {
  const snapshot = useSirenSnapshot();
  return (
    <output aria-label="Current session">{snapshot.document.root.label}</output>
  );
}

describe("session provider walls", () => {
  const documents = new DocumentCase();
  const sessions = new SessionCase();

  it("rejects a hook outside the public provider", () => {
    expect(() => render(<SnapshotLabel />)).toThrow(
      expect.objectContaining({ kind: SirenReactCode.providerMissing }),
    );
  });

  it("binds nested consumers to the nearest provider", () => {
    const outer = sessions.open(
      documents.profiled(
        documents.metadata({
          presentation: { label: "Outer", role: "detail" },
        }),
      ),
    );
    const inner = sessions.open(
      documents.profiled(
        documents.metadata({
          presentation: { label: "Inner", role: "detail" },
        }),
      ),
    );
    render(
      <SirenSessionProvider session={outer.session}>
        <SnapshotLabel />
        <SirenSessionProvider session={inner.session}>
          <SnapshotLabel />
        </SirenSessionProvider>
      </SirenSessionProvider>,
    );
    expect(
      screen
        .getAllByRole("status", { name: "Current session" })
        .map((output) => output.textContent),
    ).toEqual(["Outer", "Inner"]);
  });

  it("survives the Strict Mode setup-cleanup probe", async () => {
    const user = userEvent.setup();
    const opened = sessions.open(documents.actionable());
    render(
      <StrictMode>
        <SirenApplication
          frame={FrameFamily.focus}
          options={new StandardSirenReactOptions().create()}
          session={opened.session}
        />
      </StrictMode>,
    );
    const field = screen.getByRole("textbox", { name: /Title/ });
    await user.clear(field);
    await user.type(field, "Strictly alive");
    expect((field as HTMLInputElement).value).toBe("Strictly alive");
  });

  it("isolates two sessions rendered on one page", async () => {
    const user = userEvent.setup();
    const first = sessions.open(documents.actionable());
    const second = sessions.open(documents.actionable());
    render(
      <>
        <SirenApplication
          frame={FrameFamily.focus}
          options={new StandardSirenReactOptions().create()}
          session={first.session}
        />
        <SirenApplication
          frame={FrameFamily.focus}
          options={new StandardSirenReactOptions().create()}
          session={second.session}
        />
      </>,
    );
    const fields = screen.getAllByRole("textbox", { name: /Title/ });
    expect(fields).toHaveLength(2);
    const firstField = fields[0];
    const secondField = fields[1];
    if (!(firstField instanceof HTMLInputElement))
      throw new Error("First field");
    if (!(secondField instanceof HTMLInputElement))
      throw new Error("Second field");
    await user.clear(firstField);
    await user.type(firstField, "First only");
    expect(firstField.value).toBe("First only");
    expect(secondField.value).toBe("One");
  });

  it("contains dispatch failure after the real session closes", async () => {
    const user = userEvent.setup();
    const observer = new RecordingRendererObserver();
    const opened = sessions.open(documents.actionable());
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new OptionsCase().observer(observer)}
        session={opened.session}
      />,
    );
    opened.session.close();
    await user.clear(screen.getByRole("textbox", { name: /Title/ }));
    await waitFor(() => {
      expect(observer.failures).toHaveLength(1);
    });
    expect(observer.failures[0]).toBeInstanceOf(SirenReactError);
    expect(observer.failures[0]).toMatchObject({
      kind: SirenReactCode.rendererFailure,
      message: "Widget activation failed",
    });
  });
});
