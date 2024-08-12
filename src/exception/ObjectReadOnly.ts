export class ReadOnlyError extends Error {
  constructor(prefix: string) {
    super(`${prefix ? `${prefix} ` : ''}read only`)
  }
}
