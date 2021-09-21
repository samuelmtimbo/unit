import { EventEmitter2 } from 'eventemitter2'
import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

const __component = {}
const __component__emitter = new EventEmitter2()

export function pushGlobalComponent(id: string, component: any): void {
  __component[id] = component
  __component__emitter.emit(id, component)
}
// TODO
// should be called onDestroy

export function pullGlobalComponent(id: string): void {
  delete __component[id]
}

export function getGlobalComponent<T = any>(id: string): T {
  const component = __component[id]
  return component
}

export function listenGlobalComponent<T = any>(
  id: string,
  callback: Callback<any>
): Unlisten {
  const listener = (component) => {
    callback(component)
  }
  __component__emitter.addListener(id, listener)
  return () => {
    __component__emitter.removeListener(id, listener)
  }
}
