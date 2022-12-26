import { Element } from './client/element'

export function makeElementInputEventHandler(component: Element) {
  return function (event: InputEvent) {
    const { value } = this

    event.preventDefault()
    event.stopImmediatePropagation()

    component.set('value', value)
    component.dispatchEvent(event.type, value)
  }
}
