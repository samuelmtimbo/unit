import { Listenable } from '../Listenable'
import { Listener } from '../Listener'

export function makeMessageListener(
  listener: (event: any, _event: MessageEvent) => void,
  _global: boolean = false
): Listener {
  return (component) => {
    return listenMessage(component, listener, _global)
  }
}

export function listenMessage(
  component: Listenable,
  listener: (event: any, _event: MessageEvent) => void,
  _global: boolean = false
): () => void {
  const { $element } = component

  const messageListener = (_event: MessageEvent) => {
    listener(_event.data, _event)
  }

  $element.addEventListener('message', messageListener)

  return () => {
    $element.removeEventListener('message', messageListener)
  }
}
