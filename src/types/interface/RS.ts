import { BO } from './BO'

export interface RS extends BO {
  raw(): Promise<ReadableStream>
}
