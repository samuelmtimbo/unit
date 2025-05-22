import { Listenable } from '../Listenable'
import { Listener } from '../Listener'

export interface IOEndedEvent {}

export function makeEndedListener(
  listener: (data: IOEndedEvent, _event: Event) => void
): Listener {
  return (component) => {
    return listenEnded(component, (event, _event) => {
      listener(event, _event)
    })
  }
}

export function listenEnded(
  component: Listenable,
  onEnded: (event: IOEndedEvent, _event: Event) => void
): () => void {
  const { $element } = component

  const endedListener = (_event: Event) => {
    const {} = _event

    onEnded({}, _event)
  }

  $element.addEventListener('ended', endedListener, { passive: true })
  return () => {
    $element.removeEventListener('ended', endedListener)
  }
}
