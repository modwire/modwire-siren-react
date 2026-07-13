import {
  CancelActionCommand,
  ConfirmActionCommand,
  LoadRelationCommand,
  RequestActionCommand,
  ResetActionCommand,
  SetFieldCommand,
} from "@modwire/siren-ui/commands";

import type { CancelActionIntent } from "../domain/intents/cancel-action";
import type { ConfirmActionIntent } from "../domain/intents/confirm-action";
import type { InteractionIntent } from "../domain/intents/base";
import type { LoadRelationIntent } from "../domain/intents/load-relation";
import type { RequestActionIntent } from "../domain/intents/request-action";
import type { ResetActionIntent } from "../domain/intents/reset-action";
import type { SetFieldIntent } from "../domain/intents/set-field";
import type { InteractionIntentVisitor } from "../domain/intents/visitor";

type CommandInput =
  | CancelActionCommand
  | ConfirmActionCommand
  | LoadRelationCommand
  | RequestActionCommand
  | ResetActionCommand
  | SetFieldCommand;

export class CommandFactory implements InteractionIntentVisitor<CommandInput> {
  create(intent: InteractionIntent): CommandInput {
    return intent.accept(this);
  }

  requestAction(intent: RequestActionIntent): CommandInput {
    return new RequestActionCommand(intent.target.value);
  }

  loadRelation(intent: LoadRelationIntent): CommandInput {
    return new LoadRelationCommand(intent.target.value);
  }

  setField(intent: SetFieldIntent): CommandInput {
    return new SetFieldCommand(
      intent.target.value,
      intent.field,
      intent.value.value(),
    );
  }

  resetAction(intent: ResetActionIntent): CommandInput {
    return new ResetActionCommand(intent.target.value);
  }

  confirmAction(intent: ConfirmActionIntent): CommandInput {
    return new ConfirmActionCommand(
      intent.target.value,
      intent.acknowledgement,
    );
  }

  cancelAction(intent: CancelActionIntent): CommandInput {
    return new CancelActionCommand(intent.target.value);
  }
}
