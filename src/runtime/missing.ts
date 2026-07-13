import type { UiSessionStore } from "../adapters/store";
import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";
import type { SessionContext } from "../ports/context";

export class MissingSessionContext implements SessionContext {
  requireStore(): UiSessionStore {
    throw new SirenReactError(
      SirenReactCode.providerMissing,
      "SirenSessionProvider is required",
    );
  }
}
