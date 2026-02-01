import { System } from '../system'
import { enterFullscreen } from './enterFullscreen'
import { leaveFullscreen } from './leaveFullscreen'

export function toggleFullscreen(system: System): void {
  const {
    api: { document },
  } = system

  const isFullscreen = !!document.fullscreenElement

  if (isFullscreen) {
    leaveFullscreen(system)
  } else {
    enterFullscreen(system)
  }
}
