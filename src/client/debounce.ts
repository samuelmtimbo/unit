// http://unscriptable.com/2009/03/20/debouncing-javascript-methods/

import { System } from '../system'

export default function debounce(
  system: System,
  func: Function,
  threshold: number = 100,
  execAsap: boolean = false
) {
  let timeout: NodeJS.Timeout

  return function debounced(...args: any[]) {
    const {
      api: {
        window: { setTimeout, clearTimeout },
      },
    } = system

    // @ts-ignore
    let obj = this

    function delayed() {
      if (!execAsap) {
        func.apply(obj, args)
      }
      timeout = null
    }

    if (timeout) {
      clearTimeout(timeout)
    } else if (execAsap) {
      func.apply(obj, args)
    }

    timeout = setTimeout(delayed, threshold)
  }
}

export function animateDebounce(func: Function, execAsap: boolean = false) {
  let frame: number

  return function debounced() {
    // @ts-ignore
    let obj = this
    let args = arguments

    function delayed() {
      if (!execAsap) {
        func.apply(obj, args)
      }
      frame = null
    }

    if (frame) {
      cancelAnimationFrame(frame)
    } else if (execAsap) {
      func.apply(obj, args)
    }

    frame = requestAnimationFrame(delayed)
  }
}
