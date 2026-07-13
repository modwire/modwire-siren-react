export class ExpandableAttributes {
  for(
    group: boolean,
    expanded: boolean,
    controls: string,
  ): {
    readonly "aria-haspopup"?: "menu";
    readonly "aria-expanded"?: boolean;
    readonly "aria-controls"?: string;
  } {
    return group
      ? {
          "aria-haspopup": "menu",
          "aria-expanded": expanded,
          "aria-controls": controls,
        }
      : {};
  }
}
