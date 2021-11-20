export class DuplicatedInputFoundError extends Error {
  constructor(name: string) {
    super(`Input with name "${name}" already exists`)
  }
}
