import { AccessibilityPolicy } from "./policy";

export class StandardAccessibilityPolicy {
  create(): AccessibilityPolicy {
    return new AccessibilityPolicy(
      "Siren application",
      "Navigation",
      "Commands",
      "Content",
      "Status",
      "Inspector",
      "Search commands",
    );
  }
}
