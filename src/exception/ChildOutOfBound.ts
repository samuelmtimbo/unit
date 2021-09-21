export class ChildOutOfBound extends Error {
  constructor() {
    super('no child at this position')
  }
}
