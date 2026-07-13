export class SirenReactError extends Error {
  constructor(
    readonly kind: string,
    message: string,
    options: ErrorOptions = {},
  ) {
    super(message, options);
    this.name = "SirenReactError";
  }
}
