import type { InteractionIdentity } from "../../domain/interactions/identity";

interface ScrollPosition {
  readonly identity: string;
  readonly offset: number;
}

export class SheetScrollMemory {
  private readonly positions: ScrollPosition[] = [];

  remember(identity: InteractionIdentity, offset: number): void {
    let index = 0;
    for (const current of this.positions) {
      if (current.identity === identity.value) {
        this.positions.splice(index, 1, {
          identity: identity.value,
          offset,
        });
        return;
      }
      index += 1;
    }
    this.positions.push({ identity: identity.value, offset });
  }

  recall(identity: InteractionIdentity): number {
    for (const position of this.positions) {
      if (position.identity === identity.value) return position.offset;
    }
    return 0;
  }
}
