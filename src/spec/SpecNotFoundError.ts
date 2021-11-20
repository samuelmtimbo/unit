export class SpecNotFoundError extends Error {
  constructor() {
    super(`Could not find spec`)
  }
}
