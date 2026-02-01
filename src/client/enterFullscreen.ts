import { System } from '../system'

export function enterFullscreen(system: System): void {
  const {
    api: { document },
  } = system

  const documentElement = document.documentElement

  if (documentElement.requestFullscreen) {
    void documentElement.requestFullscreen()
  }
}
