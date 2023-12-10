import { System } from '../../../system'
import { Callback } from '../../../types/Callback'
import { Unlisten } from '../../../types/Unlisten'

// normal setTimeout seems to "never callback" when page is under high animation load

export function setTimeoutRAF(
  system: System,
  callback: Callback,
  delay: number
): Unlisten {
  const {
    api: {
      animation: { requestAnimationFrame, cancelAnimationFrame },
    },
  } = system

  let frame: number

  const start = performance.now()

  function loop(timestamp: number) {
    const elapsed = timestamp - start

    if (elapsed >= delay) {
      callback()
    } else {
      requestAnimationFrame(loop)
    }
  }

  frame = requestAnimationFrame(loop)

  return () => {
    cancelAnimationFrame(frame)
  }
}
