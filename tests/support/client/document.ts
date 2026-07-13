import { SirenClient, type JsonObject } from "@modwire/siren-client";
import type { ClientDocumentInput } from "@modwire/siren-ui";

import type { FixtureObject } from "../fixture";

export class ClientDocumentAdapter {
  private readonly client = new SirenClient();

  adapt(source: FixtureObject): ClientDocumentInput {
    const json = source as JsonObject;
    const document = this.client.parse(json);
    return {
      source: json,
      root: document.root,
      profile: document.profile,
    };
  }
}
