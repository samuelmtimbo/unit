import { Key } from '../types/Key'

export class DuplicatedOutputFoundError extends Error {
  constructor(name: Key) {
    super(`output with name "${name.toString()}" already exists`)
  }
}
