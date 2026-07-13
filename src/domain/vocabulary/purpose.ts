export class SurfacePurpose {
  private constructor(readonly value: string) {
    Object.freeze(this);
  }

  static readonly application = new SurfacePurpose("application");
  static readonly contextual = new SurfacePurpose("contextual");
  static readonly search = new SurfacePurpose("search");
}
