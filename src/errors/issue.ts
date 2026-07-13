export class SirenReactIssue {
  constructor(
    readonly code: string,
    readonly identity: string,
    readonly message: string,
  ) {
    Object.freeze(this);
  }
}
