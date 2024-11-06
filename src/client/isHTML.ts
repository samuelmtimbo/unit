import { System } from '../system'

export function isHTML(system: System, element: Node): boolean {
  const {
    api: {
      window: { HTMLElement },
    },
  } = system

  return element instanceof HTMLElement
}
