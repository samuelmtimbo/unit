import { Listenable } from '../Listenable'
import { Listener } from '../Listener'

export interface IOEndedEvent {}

export function makeAnimationListener(
  name: string,
  listener: (data: IOEndedEvent, _event: Event) => void
): Listener {
  return (component) => {
    return listenAnimation(name, component, (event, _event) => {
      listener(event, _event)
    })
  }
}

export function listenAnimation(
  name: string,
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
