export class LockedReadableStreamError extends Error {
  constructor() {
    super('cannot read a from a locked readable stream')
  }
}
