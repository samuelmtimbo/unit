import { System } from '../../system'

export function attachLayout(system: System): void {
  const {
    root,
    api: {
      document: { createElement },
    },
  } = system

  const layout = createElement('div')

  layout.style.visibility = 'hidden'

  root.shadowRoot.appendChild(layout)

  system.foreground.layout = layout
}
