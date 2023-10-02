import { System } from '../../system'

export function attachVoid(system: System): void {
  const {
    root,
    api: {
      document: { createElement },
    },
  } = system

  const invisible = createElement('div')

  invisible.style.visibility = 'hidden'

  root.shadowRoot.appendChild(invisible)

  system.foreground.void = invisible
}
