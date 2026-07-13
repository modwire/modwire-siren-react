import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    restoreMocks: true,
    setupFiles: ["./tests/support/setup.ts"],
  },
});
