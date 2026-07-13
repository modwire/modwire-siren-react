import type { CancelActionIntent } from "./cancel-action";
import type { ConfirmActionIntent } from "./confirm-action";
import type { LoadRelationIntent } from "./load-relation";
import type { RequestActionIntent } from "./request-action";
import type { ResetActionIntent } from "./reset-action";
import type { SetFieldIntent } from "./set-field";

export interface InteractionIntentVisitor<Result> {
  requestAction(intent: RequestActionIntent): Result;
  loadRelation(intent: LoadRelationIntent): Result;
  setField(intent: SetFieldIntent): Result;
  resetAction(intent: ResetActionIntent): Result;
  confirmAction(intent: ConfirmActionIntent): Result;
  cancelAction(intent: CancelActionIntent): Result;
}
