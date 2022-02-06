export class InputNotFoundError extends Error {
  constructor(name: string) {
    super(`input named "${name}" not found`)
  }
}
