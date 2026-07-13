import { SirenUiEngine, type UiSession } from "@modwire/siren-ui";

import { ClientDocumentAdapter } from "./client/document";
import { RecordingTransport, type TransportOutcome } from "./client/transport";
import type { FixtureObject } from "./fixture";

export class SessionCase {
  open(
    source: FixtureObject,
    outcomes: readonly TransportOutcome[] = [],
  ): { readonly session: UiSession; readonly transport: RecordingTransport } {
    const transport = new RecordingTransport(outcomes);
    const session = new SirenUiEngine().open(
      new ClientDocumentAdapter().adapt(source),
      transport,
    );
    return { session, transport };
  }
}
