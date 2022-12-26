export class MethodNotImplementedError extends Error {
  constructor(message?: string) {
    super('method not implemented')
  }
}
