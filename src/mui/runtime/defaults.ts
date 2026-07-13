import { HoverPolicy } from "../../policy/hover";
import { TypeaheadPolicy } from "../../policy/typeahead";

export class MuiInteractionDefaults {
  typeahead(): TypeaheadPolicy {
    return new TypeaheadPolicy(700, 64);
  }

  hover(): HoverPolicy {
    return new HoverPolicy(140, 220);
  }
}
