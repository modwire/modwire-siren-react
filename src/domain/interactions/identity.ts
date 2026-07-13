import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";
import { SirenReactIssue } from "../../errors/issue";

export class InteractionIdentity {
  constructor(readonly value: string) {
    if (!value.startsWith("/")) {
      throw new SirenReactError(
        SirenReactCode.interactionIdentity,
        "Interaction identity must be absolute",
        [
          new SirenReactIssue(
            SirenReactCode.interactionIdentity,
            value,
            "Expected an absolute semantic identity",
          ),
        ],
      );
    }
    Object.freeze(this);
  }

  child(role: string): InteractionIdentity {
    if (role === "") {
      throw new SirenReactError(
        SirenReactCode.interactionIdentity,
        "Interaction identity role cannot be empty",
      );
    }
    const escaped = role.replaceAll("~", "~0").replaceAll("/", "~1");
    return new InteractionIdentity(`${this.value}/interaction/${escaped}`);
  }
}
