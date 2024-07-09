export class ObjectPathTooDeepError extends Error {
  constructor() {
    super(`object path too deep`)
  }
}
