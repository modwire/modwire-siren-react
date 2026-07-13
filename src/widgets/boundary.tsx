import { Component, type ReactNode } from "react";

import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";
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
    try {
      this.props.observer.failed(
        new SirenReactError(
          SirenReactCode.rendererFailure,
          "Widget renderer failed",
        ),
      );
    } catch {
      // Observer failures must not escape the renderer boundary.
    }
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
