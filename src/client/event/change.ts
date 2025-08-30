import { Listener } from '../Listener'
import { listenCustom } from './custom'

export type UnitChangeEvent = any

export function makeChangeListener(
  listener: (data: UnitChangeEvent, _event: Event) => void
): Listener {
  return (component) => {
    return listenCustom('change', component, (value, _event) => {
      listener(value, _event)
    })
  }
}
