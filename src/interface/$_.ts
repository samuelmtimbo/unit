import { Unlisten } from '../Unlisten'
import { PO } from './PO'

export interface $_<I = any, O = any> {
  getGlobalId(): string

  getInterface(): string[]

  getPod(): PO

  prependListener(event: string, listener: (...data: any[]) => void): void

  addListener(event: string, listener: (...data: any[]) => void): void

  _prependListener(event: string, listener: (...data: any[]) => void): Unlisten

  _addListener(event: string, listener: (...data: any[]) => void): Unlisten

  removeListener(event: string, listener: (...data: any) => void): void

  getListeners(): string[]

  emit(event: string, data?: any): void

  destroy(): void
}
