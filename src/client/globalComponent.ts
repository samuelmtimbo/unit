import { EventEmitter2 } from 'eventemitter2'
import { Callback } from '../Callback'
import { System } from '../system'
import { Unlisten } from '../Unlisten'
import { Component } from './component'

const __component__emitter = new EventEmitter2()

export function pushGlobalComponent(
  system: System,
  id: string,
  component: any
): void {
  const {
    global: { component: _component },
  } = system

  _component[id] = component

  __component__emitter.emit(id, component)
}

// TODO
// should be called onDestroy
export function pullGlobalComponent(system: System, id: string): void {
  console.log('pullGlobalComponent', id)

  const {
    global: { component: _component },
  } = system

  delete _component[id]
}

export function getGlobalComponent(system: System, id: string): Component {
  const {
    global: { component: _component },
  } = system

  const component = _component[id]

  return component
}

export function listenGlobalComponent(
  system: System,
  id: string,
  callback: Callback<Component>
): Unlisten {
  const {
    global: { component },
  } = system

  const listener = (component: Component) => {
    callback(component)
  }
  __component__emitter.addListener(id, listener)
  return () => {
    __component__emitter.removeListener(id, listener)
  }
}
