export class OutputNotFoundError extends Error {
  constructor(name: string) {
    super(`Output named "${name}" not found`)
  }
}
