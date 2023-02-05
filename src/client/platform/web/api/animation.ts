import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webAnimation(window: Window, opt: BootOpt): API['animation'] {
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
