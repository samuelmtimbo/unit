export class ShouldNeverHappenError extends Error {
  constructor() {
    super('should never happen')
  }
}
