import type { InteractionMatcher } from "../ports/matcher";

export class LocaleInteractionMatcher implements InteractionMatcher {
  private readonly collator: Intl.Collator;
  private readonly segmenter: Intl.Segmenter;

  constructor(locale: string) {
    this.collator = new Intl.Collator(locale, {
      sensitivity: "base",
      usage: "search",
    });
    this.segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
    Object.freeze(this);
  }

  matches(candidate: string, query: string): boolean {
    const length = Array.from(this.segmenter.segment(query)).length;
    const prefix = Array.from(
      this.segmenter.segment(candidate),
      (segment) => segment.segment,
    )
      .slice(0, length)
      .join("");
    return this.collator.compare(prefix, query) === 0;
  }

  repeated(value: string): boolean {
    const segments = Array.from(
      this.segmenter.segment(value),
      (segment) => segment.segment,
    );
    if (segments.length < 2) return false;
    const reference = segments.slice(0, 1).join("");
    return segments.every(
      (segment) => this.collator.compare(segment, reference) === 0,
    );
  }
}
