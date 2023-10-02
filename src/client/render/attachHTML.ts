import { System } from '../../system'

export function attachHTML(system: System): void {
  const {
    root,
    foreground,
    api: {
      document: { createElement },
    },
  } = system

  const html = createElement('div')

  html.classList.add('__SYSTEM__HTML__')

  html.style.pointerEvents = 'none'
  html.style.position = 'absolute'
  html.style.top = '0'
  html.style.left = '0'
  html.style.zIndex = '1'

  root.shadowRoot.appendChild(html)

  foreground.html = html
}
