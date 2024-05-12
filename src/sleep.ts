export function sleep(
  setTimeout: (callback: (...args: any[]) => any, ms: number) => any,
  ms: number = 0
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
