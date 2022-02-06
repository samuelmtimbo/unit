export class OutputNotFoundError extends Error {
  constructor(name: string) {
    super(`output named "${name}" not found`)
  }
}
