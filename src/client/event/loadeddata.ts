import { Listenable } from '../Listenable'
import { Listener } from '../Listener'

export interface IOLoadEvent {}

export function makeLoadedDataListener(
  listener: (data: IOLoadEvent, _event: Event) => void
): Listener {
  return (component) => {
    return listenLoadedData(component, (event, _event) => {
      listener(event, _event)
    })
  }
}

export function listenLoadedData(
  component: Listenable,
  onLoad: (event: IOLoadEvent, _event: Event) => void
): () => void {
  const { $element } = component

  const listener = (_event: Event) => {
    const {} = _event

    onLoad({}, _event)
  }

  $element.addEventListener('loadeddata', listener, { passive: true })
  return () => {
    $element.removeEventListener('loadeddata', listener)
  }
}
