import { Block } from "../../index.ts";

/**
 * This block generates `n + 1`.
 */
export const generator: Block = {
  id: "generator",
  name: "Generator Block",
  version: "0.1.0",
  run: (n, i) => [n, i + 1],
};
