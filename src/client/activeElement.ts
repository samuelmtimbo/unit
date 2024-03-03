import { System } from '../system'

export function getActiveElement(system: System): Element {
  const { root } = system

  return root.shadowRoot.activeElement
}
