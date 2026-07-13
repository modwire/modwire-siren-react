import type { SirenResponse } from "@modwire/siren-client";

import type { FixtureObject } from "../fixture";
import { ResponseCase } from "./responses";

export class PendingResponse {
  readonly promise: Promise<SirenResponse>;
  private complete: (response: SirenResponse) => void = () => undefined;

  constructor() {
    this.promise = new Promise((resolve) => {
      this.complete = resolve;
    });
  }

  resolveDocument(body: FixtureObject): void {
    this.complete(new ResponseCase().document(body));
  }
}
