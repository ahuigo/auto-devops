export default function getArgs() {
  const args = {} as Record<string, any>;
  console.log('argv', process.argv);
  process.argv
    .slice(2, process.argv.length)
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