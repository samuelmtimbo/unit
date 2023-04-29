// http://unscriptable.com/2009/03/20/debouncing-javascript-methods/

export default function debounce(
  func: Function,
  threshold: number = 100,
  execAsap: boolean = false
) {
  let timeout

  return function debounced() {
    // @ts-ignore
    let obj = this
    let args = arguments

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
  let timeout

  return function debounced() {
    // @ts-ignore
    let obj = this
    let args = arguments

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

    timeout = requestAnimationFrame(delayed)
  }
}
