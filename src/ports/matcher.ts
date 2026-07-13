export interface InteractionMatcher {
  matches(candidate: string, query: string): boolean;
  repeated(value: string): boolean;
}
