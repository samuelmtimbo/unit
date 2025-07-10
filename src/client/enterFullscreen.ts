export function enterFullscreen(): void {
  const documentElement = document.documentElement

  if (documentElement.requestFullscreen) {
    void documentElement.requestFullscreen()
  }
}
