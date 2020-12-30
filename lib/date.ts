export function sleep(timeout: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(timeout), timeout * 1000);
  });
}
