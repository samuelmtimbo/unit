import { Listenable } from '../Listenable'
import { Listener } from '../Listener'

export type IOPasteEvent = string

export function makePasteListener(
  listener: (value: IOPasteEvent) => void
): Listener {
  return (component) => {
    return listenPaste(component, (value) => {
      listener(value)
    })
  }
}

export function listenPaste(
  component: Listenable,
  listener: (value: IOPasteEvent, _event: ClipboardEvent) => void
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
