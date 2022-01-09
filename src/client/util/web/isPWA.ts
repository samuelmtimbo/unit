export const DEFAULT_PWA_DISPLAY_MODE = 'fullscreen'

export const isPWA: boolean = window.matchMedia(
  `(display-mode: ${DEFAULT_PWA_DISPLAY_MODE})`
).matches
