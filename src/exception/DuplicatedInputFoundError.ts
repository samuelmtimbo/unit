import { Key } from '../types/Key'

export class DuplicatedInputFoundError extends Error {
  constructor(name: Key) {
    super(`input with name "${name.toString()}" already exists`)
  }
}
