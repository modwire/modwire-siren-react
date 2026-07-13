import type { SessionInput } from "./session";

export class UiDispatcher {
  constructor(private readonly session: SessionInput) {}

  dispatch(
    command: Parameters<SessionInput["dispatch"]>[0],
  ): ReturnType<SessionInput["dispatch"]> {
    return this.session.dispatch(command);
  }
}
