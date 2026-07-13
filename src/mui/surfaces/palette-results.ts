import { InteractionCollection } from "../../domain/interactions/collection";
import type { InteractionNode } from "../../domain/interactions/base";
import { SearchingInteractionState } from "../../domain/state/searching";
import type { InteractionSnapshot } from "../../domain/state/snapshot";
import type { MuiInteractionReader } from "../shared/reader";

export class PaletteResults {
  select(
    snapshot: InteractionSnapshot,
    reader: MuiInteractionReader,
  ): InteractionCollection<InteractionNode> {
    if (!(snapshot.state instanceof SearchingInteractionState)) {
      return reader.leaves();
    }
    return new InteractionCollection(
      snapshot.state.results.values.map((identity) => reader.node(identity)),
    );
  }
}
