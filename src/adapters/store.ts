import { SirenReactCode } from "../errors/code";
import { SirenReactError } from "../errors/error";
import type { StoreConnection } from "../ports/connection";
import { ActiveConnection } from "./active";
import { UiDispatcher } from "./dispatcher";
import { InactiveConnection } from "./inactive";
import { SessionObserver } from "./observer";
import type { SessionInput } from "./session";
import type { SnapshotInput } from "./snapshot";

export class UiSessionStore {
  private readonly listeners = new Set<() => void>();
  private connection: StoreConnection = new InactiveConnection();
  private current: SnapshotInput;
  private disposed = false;
  readonly dispatcher: UiDispatcher;

  constructor(private readonly session: SessionInput) {
    this.current = session.snapshot;
    this.dispatcher = new UiDispatcher(session);
  }

  readonly getSnapshot = (): SnapshotInput => this.current;

  readonly getServerSnapshot = (): SnapshotInput => this.current;

  readonly subscribe = (listener: () => void): (() => void) => {
    this.assertAvailable();
    this.listeners.add(listener);
    if (this.listeners.size === 1) this.connect();
    let subscribed = true;
    return () => {
      if (!subscribed) return;
      subscribed = false;
      this.listeners.delete(listener);
      if (this.listeners.size === 0) this.disconnect();
    };
  };

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.disconnect();
    this.listeners.clear();
  }

  private connect(): void {
    const observer = new SessionObserver((snapshot) => {
      this.changed(snapshot);
    });
    this.connection = new ActiveConnection(this.session.subscribe(observer));
  }

  private disconnect(): void {
    this.connection.disconnect();
    this.connection = new InactiveConnection();
  }

  private changed(snapshot: SnapshotInput): void {
    if (snapshot === this.current) return;
    this.current = snapshot;
    for (const listener of [...this.listeners]) {
      try {
        listener();
      } catch {
        continue;
      }
    }
  }

  private assertAvailable(): void {
    if (this.disposed) {
      throw new SirenReactError(
        SirenReactCode.storeDisposed,
        "Siren session store is disposed",
      );
    }
  }
}
