import { System } from '../system'

export function leaveFullscreen(system: System): void {
  const {
    api: { document },
  } = system

  const isFullscreen = !!document.fullscreenElement

  if (isFullscreen) {
    void document.exitFullscreen()
  }
}
