import { Listenable } from '../Listenable'
import { Listener } from '../Listener'

export interface IOScrollEvent {}

export function makeScrollListener(
  listener: (data: IOScrollEvent, _event: Event) => void
): Listener {
  return (component) => {
    return listenScroll(component, (event, _event) => {
      listener(event, _event)
    })
  }
}

export function listenScroll(
  component: Listenable,
  onScroll: (event: IOScrollEvent, _event: Event) => void
): () => void {
  const { $element } = component

  const scrollListener = (_event: Event) => {
    const {} = _event

    onScroll({}, _event)
  }

  $element.addEventListener('scroll', scrollListener, { passive: true })
  return () => {
    $element.removeEventListener('scroll', scrollListener)
  }
}
