import { Listenable } from '../Listenable'
import { Listener } from '../Listener'

export type UnitPasteEvent = string

export function makePasteListener(
  listener: (value: UnitPasteEvent, _event: ClipboardEvent) => void
): Listener {
  return (component) => {
    return listenPaste(component, (value, _event) => {
      listener(value, _event)
    })
  }
}

export function listenPaste(
  component: Listenable,
  listener: (value: UnitPasteEvent, _event: ClipboardEvent) => void
): () => void {
  const { $element } = component
  const _listener = (_event: ClipboardEvent) => {
    const { clipboardData } = _event

    const value = (clipboardData && clipboardData.getData('text/plain')) || ''

    listener(value, _event)
  }
  $element.addEventListener('paste', _listener)
  return () => {
    $element.removeEventListener('paste', _listener)
  }
}
