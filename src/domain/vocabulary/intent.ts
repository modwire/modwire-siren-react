import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";

export class ActionIntent {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  static readonly primary = new ActionIntent("primary");
  static readonly secondary = new ActionIntent("secondary");
  static readonly destructive = new ActionIntent("destructive");
  static readonly navigation = new ActionIntent("navigation");
  static readonly background = new ActionIntent("background");
  static readonly values = Object.freeze([
    ActionIntent.primary,
    ActionIntent.secondary,
    ActionIntent.destructive,
    ActionIntent.navigation,
    ActionIntent.background,
  ]);

  static from(value: string): ActionIntent {
    for (const intent of ActionIntent.values) {
      if (intent.value === value) return intent;
    }
    throw new SirenReactError(
      SirenReactCode.interactionIntent,
      `Unknown action intent: '${value}'`,
    );
  }
}
