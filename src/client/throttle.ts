// https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf

import { System } from '../system'

export const throttle = (system: System, func: Function, limit): any => {
  const {
    api: {
      // TODO
    },
  } = system

  let lastFunc
  let lastRan

  return function (...args) {
    const context = this

    if (!lastRan) {
      func.apply(context, args)
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc)

      lastFunc = setTimeout(
        function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args)
            lastRan = Date.now()
          }
        },
        limit - (Date.now() - lastRan)
      )
    }
  }
}
