import { IconReference } from "../../domain/interactions/icon-reference";
import type { InteractionIcon } from "../../domain/interactions/icon";
import type { IconFactory } from "../../ports/icon-factory";
import type { IconRegistry } from "../../ports/icon-registry";
import type { IconRegistration } from "./registration";
import type { RendererObserver } from "../../ports/renderer-observer";
import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";
import { RendererReporter } from "../../errors/reporter";

export class LocalIconRegistry implements IconRegistry {
  private readonly registrations: readonly IconRegistration[];
  private readonly reported = new Set<string>();

  constructor(
    registrations: readonly IconRegistration[],
    private readonly unknown: IconFactory,
    private readonly observer: RendererObserver,
  ) {
    this.registrations = Object.freeze([...registrations]);
    Object.freeze(this);
  }

  resolve(icon: InteractionIcon, fallback: IconReference): React.ReactElement {
    if (icon instanceof IconReference) return this.find(icon.key).create();
    return this.find(fallback.key).create();
  }

  private find(key: string): IconFactory {
    for (const registration of this.registrations) {
      if (registration.key === key) return registration.factory;
    }
    if (!this.reported.has(key)) {
      this.reported.add(key);
      new RendererReporter(this.observer).report(
        new SirenReactError(
          SirenReactCode.iconUnknown,
          `Icon is not registered: '${key}'`,
        ),
      );
    }
    return this.unknown;
  }
}
