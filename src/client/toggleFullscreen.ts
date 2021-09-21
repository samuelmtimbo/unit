import { enterFullscreen } from './enterFullscreen'
import { leaveFullscreen } from './leaveFullscreen'

export function toggleFullscreen(): void {
  const isFullscreen = !!document.fullscreenElement
  if (isFullscreen) {
    leaveFullscreen()
  } else {
    enterFullscreen()
  }
}
