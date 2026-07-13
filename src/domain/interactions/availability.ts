export abstract class InteractionAvailability {
  protected constructor(
    readonly kind: string,
    readonly activatable: boolean,
  ) {}
}
