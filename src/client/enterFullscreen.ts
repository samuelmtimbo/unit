export function enterFullscreen(): void {
  const documentElement = document.documentElement
  if (documentElement.requestFullscreen) {
    documentElement.requestFullscreen()
  }
}
