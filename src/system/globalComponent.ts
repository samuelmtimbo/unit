import { Component } from '../client/component'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { Unlisten } from '../types/Unlisten'

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

export function firstGlobalComponentPromise(
  system: System,
  id: string
): Promise<Component> {
  const { emitter } = system

  let component: Component
  let system_: System = system

  while (system_ && !component) {
    component = system_.getLocalComponents(id)[0]

    system_ = system_.parent
  }

  if (component) {
    return Promise.resolve(component)
  }

  return new Promise((resolve) => {
    const listener = (component: Component) => {
      emitter.removeListener(id, listener)

      resolve(component)
    }

    emitter.addListener(id, listener)
  })
}
