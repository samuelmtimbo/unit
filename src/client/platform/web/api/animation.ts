import { API } from '../../../../system'

export function webAnimation(window: Window, prefix: string): API['animation'] {
  const animation = {
    requestAnimationFrame: (callback) => {
      return window.requestAnimationFrame(callback)
    },
    cancelAnimationFrame: (frame: number) => {
      return window.cancelAnimationFrame(frame)
    },
  }

  return animation
}
