import type { IconReference } from "../../domain/interactions/icon-reference";
import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";
import type { IconFactory } from "../../ports/icon-factory";
import { LocalIconRegistry } from "./registry";
import { IconRegistration } from "./registration";
import type { RendererObserver } from "../../ports/renderer-observer";

export class IconRegistryBuilder {
  private readonly registrations: IconRegistration[] = [];

  register(reference: IconReference, factory: IconFactory): this {
    if (
      this.registrations.some(
        (registration) => registration.key === reference.key,
      )
    ) {
      throw new SirenReactError(
        SirenReactCode.iconDuplicate,
        `Icon is already registered: '${reference.key}'`,
      );
    }
    this.registrations.push(new IconRegistration(reference.key, factory));
    return this;
  }

  build(unknown: IconFactory, observer: RendererObserver): LocalIconRegistry {
    return new LocalIconRegistry(this.registrations, unknown, observer);
  }
}
