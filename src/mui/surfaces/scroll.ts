export class SheetScrollAdapter {
  restore(element: HTMLUListElement | null, offset: number): void {
    if (element) element.scrollTop = offset;
  }
}
