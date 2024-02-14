import { Listener } from '../../Listener'

export type IOToggleEvent = any

export function makeToggleListener(
  listener: (data: IOToggleEvent, _event: ToggleEvent) => void
): Listener {
  return (component) => {
    const { $element } = component

    const toggleListener = (_event: ToggleEvent) => {
      const { newState, oldState } = _event

      if (newState !== oldState) {
        const open = newState === 'open' ? true : false

        listener(open, _event)
      }
    }

    $element.addEventListener('toggle', toggleListener)

    return () => {
      $element.removeEventListener('toggle', toggleListener)
    }
  }
}
