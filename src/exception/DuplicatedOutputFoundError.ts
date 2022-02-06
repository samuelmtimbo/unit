export class DuplicatedOutputFoundError extends Error {
  constructor(name: string) {
    super(`output with name "${name}" already exists`)
  }
}
