# Gusano 🐍

> A minimal workflows lib for Deno 🦖

## Simple example

```ts

const sum : Block {

    id: 'sum',
    name: 'Sum block',

    run: (a, b) => Number(a) + Number(b),

    version: '0.1.0'

}

const engine = new Engine({ sum })

engine.on('end', ({ result, time }) => {
    console.log(result) // [3]
    console.log(time)   // 2
})

engine.start('sum', 1, 2)

```

## A more complex example / Prime generator

```ts
/**
 * This block generates `n + 1`.
 */
export const generator: Block = {
  id: "generator",
  name: "Generator Block",
  version: "0.1.0",
  run: (n, i) => [n, i + 1],
};

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

const engine = new Engine(
  { isPrime, generator },
  {
    // always go to `isPrime` block after execution.
    generator: "isPrime",

    /**
     * Test if `i >= n`, if true, end... else continue
     */
    isPrime: (n: number, i: number, isPrime: boolean) =>
      i >= n ? null : "generator",
  }
);

engine.on('end', console.log) // { result: [2, 3, 5, 7, ...], time: 2 }

engine.start('generator', 100, 1)
```
