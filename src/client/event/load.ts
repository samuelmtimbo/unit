import { Listenable } from '../Listenable'
import { Listener } from '../Listener'

export interface IOLoadEvent {}

export function makeLoadListener(
  listener: (data: IOLoadEvent, _event: Event) => void
): Listener {
  return (component) => {
    return listenLoad(component, (event, _event) => {
      listener(event, _event)
    })
  }
}

export function listenLoad(
  component: Listenable,
  onLoad: (event: IOLoadEvent, _event: Event) => void
): () => void {
  const { $element } = component

  const loadListener = (_event: Event) => {
    const {} = _event

    onLoad({}, _event)
  }

  $element.addEventListener('load', loadListener, { passive: true })
  return () => {
    $element.removeEventListener('load', loadListener)
  }
}
