export function leaveFullscreen(): void {
  const isFullscreen = !!document.fullscreenElement
  if (isFullscreen) {
    void document.exitFullscreen()
  }
}
