import { Unlisten } from '../Unlisten'
import { PO } from './PO'
import { S } from './S'

export interface $_<I = any, O = any> {
  getGlobalId(): string

  getInterface(): string[]

  refSystem(): S | null

  refPod(): PO | null

  attach($system: S, $pod: PO): void

  dettach(): void

  prependListener(event: string, listener: (...data: any[]) => void): void

  addListener(event: string, listener: (...data: any[]) => void): void

  _prependListener(event: string, listener: (...data: any[]) => void): Unlisten

  _addListener(event: string, listener: (...data: any[]) => void): Unlisten

  removeListener(event: string, listener: (...data: any) => void): void

  getListeners(): string[]

  emit(event: string, ...args: any[]): void

  destroy(): void
}
