export class DuplicatedOutputFoundError extends Error {
  constructor(name: string) {
    super(`Output with name "${name}" already exists`)
  }
}
