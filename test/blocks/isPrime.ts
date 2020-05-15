import { Block } from "../../lib/block.ts";

/**
 * This block test if `i` is a prime.
 */
export const isPrime: Block = {
  id: "isPrime",
  name: "IsPrime Block",
  version: "0.1.0",
  run(n, i) {
    if (i == 2 || i == 3) return [n, i, true];
    if (i <= 1 || i % 2 == 0) return [n, i, false];

    for (let j = 3; j < i; j += 2) {
      if (i % j == 0) return [n, i, false];
    }

    return [n, i, true];
  },
};
