// http://unscriptable.com/2009/03/20/debouncing-javascript-methods/

import { System } from '../system'

export function debounce(
  system: System,
  func: Function,
  threshold: number = 100,
  execAsap: boolean = false
) {
  let timeout: number

  return function debounced(...args: any[]) {
    const {
      api: {
        window: { setTimeout, clearTimeout },
      },
    } = system

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

export function animateDebounce(
  system: System,
  func: Function,
  execAsap: boolean = false
) {
  const {
    api: {
      animation: { requestAnimationFrame, cancelAnimationFrame },
    },
  } = system

  let frame: number

  return function debounced() {
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
