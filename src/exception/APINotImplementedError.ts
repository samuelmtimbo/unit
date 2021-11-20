export class APINotImplementedError extends Error {
  constructor(name: string) {
    super(`${name} API not implemented.`)
  }
}
