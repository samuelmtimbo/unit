export function _if(condition: boolean, f: Function, ...args: any[]): void {
  if (condition) {
    f(...args)
  }
}
