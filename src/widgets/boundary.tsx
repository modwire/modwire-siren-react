import { Component, type ReactNode } from "react";

import { RendererReporter } from "../errors/reporter";
import type { RendererObserver } from "../ports/renderer-observer";

export interface WidgetBoundaryProps {
  readonly children: ReactNode;
  readonly fallback: ReactNode;
  readonly observer: RendererObserver;
  readonly revision: number;
}

interface WidgetBoundaryState {
  readonly failed: boolean;
}

export class WidgetBoundary extends Component<
  WidgetBoundaryProps,
  WidgetBoundaryState
> {
  override state: WidgetBoundaryState = Object.freeze({ failed: false });

  static getDerivedStateFromError(): WidgetBoundaryState {
    return Object.freeze({ failed: true });
  }

  override componentDidCatch(): void {
    new RendererReporter(this.props.observer).failure("Widget renderer failed");
  }

  override componentDidUpdate(previous: WidgetBoundaryProps): void {
    if (this.state.failed && previous.revision !== this.props.revision) {
      this.setState(Object.freeze({ failed: false }));
    }
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
