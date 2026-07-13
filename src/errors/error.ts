import type { SirenReactIssue } from "./issue";

export class SirenReactError extends Error {
  readonly issues: readonly SirenReactIssue[];

  constructor(
    readonly kind: string,
    message: string,
    issues: readonly SirenReactIssue[] = [],
    options: ErrorOptions = {},
  ) {
    super(message, options);
    this.name = "SirenReactError";
    this.issues = Object.freeze([...issues]);
  }
}
