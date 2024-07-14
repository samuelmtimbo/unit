import { Key } from '../types/Key'

export class InputNotFoundError extends Error {
  constructor(name: Key) {
    super(`input named "${name.toString()}" not found`)
  }
}
