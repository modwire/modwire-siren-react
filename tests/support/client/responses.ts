import type { JsonObject, SirenResponse } from "@modwire/siren-client";

import type { FixtureObject } from "../fixture";

export class ResponseCase {
  document(body: FixtureObject, status = 200): SirenResponse {
    return {
      body: body as JsonObject,
      headers: {},
      kind: "document",
      status,
    };
  }
}
