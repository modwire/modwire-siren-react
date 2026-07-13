import type { StoreConnection } from "../ports/connection";

export class InactiveConnection implements StoreConnection {
  disconnect(): void {
    return;
  }
}
