import { System } from '../../system'

export const SYSTEM_APP_ID = '__SYSTEM__APP__'

export function attachApp(system: System): void {
  const {
    root,
    api: {
      document: { createElement },
    },
  } = system

  const app = createElement('div')

  app.id = SYSTEM_APP_ID

  app.style.position = 'absolute'
  app.style.width = '100%'
  app.style.height = '100%'
  app.style.top = '0'
  app.style.left = '0'
  app.style.zIndex = '1'
  app.style.overflow = 'auto'

  root.shadowRoot.appendChild(app)

  system.foreground.app = app
}
