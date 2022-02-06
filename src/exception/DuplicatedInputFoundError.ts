export class DuplicatedInputFoundError extends Error {
  constructor(name: string) {
    super(`input with name "${name}" already exists`)
  }
}
