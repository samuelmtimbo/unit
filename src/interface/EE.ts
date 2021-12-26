import { Unlisten } from '../Unlisten'

export interface EE {
  prependListener(event: string, listener: (...data: any[]) => void): Unlisten

  addListener(event: string, listener: (...data: any[]) => void): Unlisten

  removeListener(event: string, listener: (...data: any) => void): void

  eventNames(): string[]

  emit(event: string, ...args: any[]): void

  listenerCount(name: string): number
}
