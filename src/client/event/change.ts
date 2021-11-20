import { Listener } from '../Listener'
import { listenCustom } from './custom'

export type IOChangeEvent = any

export function makeChangeListener(
  listener: (data: IOChangeEvent) => void
): Listener {
  return (component) => {
    return listenCustom('change', component, (value) => {
      listener(value)
    })
  }
}
