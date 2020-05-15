import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { Block } from "../lib/block.ts";
import { Engine } from "../lib/engine.ts";

import { isPrime } from "./blocks/isPrime.ts";
import { generator } from "./blocks/generator.ts";

const sum: Block = {
  id: "sum",
  name: "Sum Block",
  version: "0.1.0",

  run(a, b) {
    return Number(a) + Number(b);
  },
};

Deno.test("basic block", () => {
  const result = sum.run(1, 2);

  assertEquals(sum.id, "sum");
  assertEquals(sum.name, "Sum Block");
  assertEquals(sum.version, "0.1.0");
  assertEquals(result, 3);
});

Deno.test("basic engine", () => {
  const engine = new Engine({ sum });

  engine.on("end", ({ result, time }) => {
    assertEquals(result, [3]);
    assertEquals(typeof time, "number");
  });

  engine.start("sum", 1, 2);
});

/**
 * More complex example
 */

Deno.test("prime generator engine", () => {
  const engine = new Engine(
    { isPrime, generator },
    {
      // always go to `isPrime` block after execution.
      generator: "isPrime",

      /**
       * Test if `i > n`, if true, end... else continue
       */
      isPrime: (n: number, i: number, isPrime: boolean) => {
        if (i > n) return;
        return "generator";
      },
    }
  );

  const primes = [
    2,
    3,
    5,
    7,
    11,
    13,
    17,
    19,
    23,
    29,
    31,
    37,
    41,
    43,
    47,
    53,
    59,
    61,
    67,
    71,
    73,
    79,
    83,
    89,
    97,
    101,
  ];

  let results: number[] = [];

  engine.on("block isPrime result", ({ params, result }) => {
    const [, , isPrime] = result;
    const [, i] = params;

    if (isPrime) {
      results.push(i);
    }
  });

  engine.on("end", ({ time }) => {
    console.log("ended => time: " + time);

    assertEquals(primes, results);
  });

  engine.start("generator", 100, 1);
});
