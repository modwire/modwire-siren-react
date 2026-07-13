import type { NavigationPort } from "../ports/navigation";

export class AbsentNavigationPort implements NavigationPort {
  navigate(): void {
    Object.freeze(this);
  }
}
