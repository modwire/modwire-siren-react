import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { MediaQueryController } from "./media";
import { TestResizeObserver } from "./resize-observer";

new MediaQueryController().install();
globalThis.ResizeObserver = TestResizeObserver;
HTMLElement.prototype.scrollIntoView = () => undefined;
Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", true);

afterEach(() => {
  cleanup();
});
