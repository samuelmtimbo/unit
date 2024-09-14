import { _addEventListener } from '..'
import { Listenable } from '../../Listenable'
import { Listener } from '../../Listener'
import { stopByPropagation } from '../../stopPropagation'

export function makeCustomListener(
  type: string,
  listener: (data: any, _event: CustomEvent) => void,
  global: boolean = false
): Listener {
  return (component) => {
    return listenCustom(type, component, listener, global)
  }
}

export function listenCustom(
  type: string,
  component: Listenable,
  listener: (data: any, _event: CustomEvent) => void,
  global: boolean = false
): () => void {
  const { $system, $element } = component

  const _type = `_${type}`

  const { customEvent, context } = $system

  if (!customEvent.has(type)) {
    for (const c of context) {
      stopByPropagation(c.$element, _type)
    }

    customEvent.add(type)
  }

  const _listener = (_event: CustomEvent) => {
    const { detail } = _event
    listener(detail, _event)
  }

  const unlisten = _addEventListener(_type, $element, _listener, global)

  return unlisten
}
