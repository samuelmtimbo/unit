import { Listener } from '../Listener'
import { listenCustom } from './custom'

export type IOChangeEvent = any

export function makeInputListener(
  listener: (data: IOChangeEvent, _event: CustomEvent<any>) => void
): Listener {
  return (component) => {
    return listenCustom('input', component, (event, _event) => {
      listener(event, _event)
    })
  }
}
