import type { PresentationAction } from "./action";
import type { PresentationGroup } from "./group";
import type { PresentationRelation } from "./relation";

export interface PresentationVisitor<Result> {
  action(interaction: PresentationAction): Result;
  relation(interaction: PresentationRelation): Result;
  group(interaction: PresentationGroup): Result;
}
