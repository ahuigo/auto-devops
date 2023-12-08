export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function getArgs() {
  const args = {} as Record<string, string | boolean>;
  console.log('argv', Deno.args);
  Deno.args
    .forEach(arg => {
      // long arg
      if (arg.includes('=')) {
        const longArg = arg.split('=');
        const longArgFlag = longArg[0];
        const longArgValue = longArg.length > 1 ? longArg[1] : true;
        args[longArgFlag] = longArgValue;
      }
    });
  return args;
}

export {
  Document,
  DOMParser,
  HTMLElement,
  HTMLMetaElement,
} from "https://esm.sh/linkedom@0.15.1";
export { delay } from "https://deno.land/std@0.208.0/async/delay.ts";
export { retry } from "https://deno.land/std@0.208.0/async/retry.ts";
