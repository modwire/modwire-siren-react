import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  FrameFamily,
  SirenApplication,
  StandardSirenReactOptions,
} from "@modwire/siren-react";

import { DocumentCase } from "../support/documents";
import { SessionCase } from "../support/sessions";

describe("published application entrance", () => {
  it("renders a real profiled Siren session", () => {
    const opened = new SessionCase().open(new DocumentCase().actionable());
    render(
      <SirenApplication
        frame={FrameFamily.focus}
        options={new StandardSirenReactOptions().create()}
        session={opened.session}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Record" }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Save record" })).toBeTruthy();
  });
});
