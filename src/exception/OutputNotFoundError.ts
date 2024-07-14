import { Key } from '../types/Key'

export class OutputNotFoundError extends Error {
  constructor(name: Key) {
    super(`output named "${name.toString()}" not found`)
  }
}
