export const animateThrottle = (
  func: Function,
  requestAnimationFrame: (callback: FrameRequestCallback) => number,
  cancelAnimationFrame: (frame: number) => void
): { f: (...args: any[]) => void; abort: () => void } => {
  let run = true
  let frame: number
  let run_last: boolean = false

  function g(...args: any[]) {
    run = true

    if (run_last) {
      run_last = false

      func(...args)
    }
  }

  function f(...args: any[]) {
    if (run) {
      run = false

      run_last = false

      cancelAnimationFrame(frame)

      func(...args)

      frame = requestAnimationFrame(g.bind(null, ...args))
    } else {
      run_last = true
    }
  }

  function abort() {
    if (frame !== undefined) {
      cancelAnimationFrame(frame)

      frame = undefined
    }
  }

  return { f, abort }
}
