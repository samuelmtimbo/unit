export class APINotSupportedError extends Error {
  constructor(name: string) {
    super(`${name} API not implemented`)
  }
}
