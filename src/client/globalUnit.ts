import { EventEmitter2 } from 'eventemitter2'
import { Callback } from '../Callback'
import { Dict } from '../types/Dict'
import { Unlisten } from '../Unlisten'
import { randomIdNotIn } from '../util/id'

const __unit: Dict<any> = {}

export const __unit__emitter = new EventEmitter2()

export function getGlobalRef(id: string): any {
  return __unit[id] || null
}

export function setGlobalRef(unit: any): string {
  const id = randomIdNotIn(__unit)
  __unit[id] = unit
  return id
}

export function deleteGlobalRef(id: string): void {
  delete __unit[id]
}

export function listenGlobalRef(id: string, callback: Callback<any>): Unlisten {
  const listener = (unit) => {
    callback(unit)
  }
  __unit__emitter.addListener(id, listener)
  return () => {
    __unit__emitter.removeListener(id, listener)
  }
}
