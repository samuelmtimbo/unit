export class ShouldNeverHappenError extends Error {
  constructor() {
    super('Should never happen')
  }
}
