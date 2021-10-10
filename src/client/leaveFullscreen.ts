export function leaveFullscreen(): void {
  const isFullscreen = !!document.fullscreenElement
  if (isFullscreen) {
    document.exitFullscreen()
  }
}
