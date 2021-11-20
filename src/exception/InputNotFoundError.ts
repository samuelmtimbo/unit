export class InputNotFoundError extends Error {
  constructor(name: string) {
    super(`Input named "${name}" not found`)
  }
}
