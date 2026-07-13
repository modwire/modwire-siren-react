import { SirenReactCode } from "../../errors/code";
import { SirenReactError } from "../../errors/error";
import { SirenReactIssue } from "../../errors/issue";
import type { InteractionNode } from "./base";
import { InteractionGroup } from "./group";

export class InteractionTree {
  constructor(readonly root: InteractionGroup) {
    this.assertUnique(root, new Set());
    Object.freeze(this);
  }

  private assertUnique(node: InteractionNode, identities: Set<string>): void {
    if (identities.has(node.identity.value)) {
      throw new SirenReactError(
        SirenReactCode.interactionDuplicate,
        `Duplicate interaction identity: '${node.identity.value}'`,
        [
          new SirenReactIssue(
            SirenReactCode.interactionDuplicate,
            node.identity.value,
            "Interaction identities must be unique within a tree",
          ),
        ],
      );
    }
    identities.add(node.identity.value);
    if (node instanceof InteractionGroup) {
      for (const child of node.children) {
        this.assertUnique(child, identities);
      }
    }
  }
}
