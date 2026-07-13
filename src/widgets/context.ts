import type { AccessibilityIdentityFactory } from "../accessibility/identity";
import type { InteractionActivator } from "../ports/activator";
import type { IconRegistry } from "../ports/icon-registry";
import type { RendererObserver } from "../ports/renderer-observer";
import type { WidgetRegistry } from "../ports/widget-registry";
import type { InteractionDensity } from "../domain/vocabulary/density";
import type { WidgetNode } from "../domain/widgets/base";
import type { PresentationSnapshot } from "../domain/presentation/snapshot";

export class WidgetContext {
  constructor(
    readonly node: WidgetNode,
    readonly snapshot: PresentationSnapshot,
    readonly density: InteractionDensity,
    readonly identities: AccessibilityIdentityFactory,
    readonly activator: InteractionActivator,
    readonly icons: IconRegistry,
    readonly registry: WidgetRegistry,
    readonly observer: RendererObserver,
  ) {
    Object.freeze(this);
  }

  withNode(node: WidgetNode): WidgetContext {
    return new WidgetContext(
      node,
      this.snapshot,
      this.density,
      this.identities,
      this.activator,
      this.icons,
      this.registry,
      this.observer,
    );
  }
}
