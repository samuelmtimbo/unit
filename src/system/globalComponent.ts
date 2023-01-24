import { Component } from '../client/component'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { Unlisten } from '../types/Unlisten'

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
  const { emitter } = system

  const listener = (component: Component) => {
    callback(component)
  }

  emitter.addListener(id, listener)

  return () => {
    emitter.removeListener(id, listener)
  }
}
