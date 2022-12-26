export class InvalidStateError extends Error {
  constructor(message?: string) {
    super(message ?? 'invalid state')
  }
}
