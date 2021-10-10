import { System } from '../../boot'

export function attachApp($system: System): void {
  const { $root } = $system

  const app = document.createElement('div')

  app.id = '__SYSTEM__APP__'

  app.style.position = 'absolute'
  app.style.width = '100%'
  app.style.height = '100%'
  app.style.top = '0'
  app.style.left = '0'

  $root.appendChild(app)

  $system.$foreground.$app = app
}
