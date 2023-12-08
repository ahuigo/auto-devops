import { parse, stringify } from "$std/yaml/mod.ts";
const text = `
foo: bar
baz:
  - qux
  - quux
`;

Deno.test("yaml", () => {
  const data = parse(text) as any;
  console.log(data.foo);
  console.log(data.baz.length);
  const obj = {
    hello: "world",
    numbers: [1, 2, 3],
  };
  const yaml = stringify(obj);
  console.log(yaml);
  // hello: word
  // numbers:
  //   - 1
  //   - 2
  //   - 3
});