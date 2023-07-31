import { ASYNC_GRAPH_PROXY_CALL_FILTER } from './constant/ASYNC_GRAPH_PROXY_CALL_FILTER'
import { ASYNC_GRAPH_PROXY_WATCH_FILTER } from './constant/ASYNC_GRAPH_PROXY_WATCH_FILTER'
import { Moment } from './debug/Moment'
import { AllTypes } from './interface'
import { AllKeys } from './types/AllKeys'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import { Unlisten } from './types/Unlisten'

export function proxy<T extends object>(
  unit: T,
  CALL: Dict<string>,
  WATCH: Set<string>
): T {
  let stop_event: string = undefined

  const proxy = new Proxy(unit, {
    get: (target, name: string) => {
      const value = target[name]

      if (CALL[name]) {
        stop_event = CALL[name]
      } else if (WATCH.has(name)) {
        return (data: any, callback: Callback<any>): Unlisten => {
          return value.call(target, data, (moment: Moment) => {
            const { event } = moment

            if (
              stop_event === event &&
              (moment.data?.path?.length ?? 0) === 0
            ) {
              stop_event = undefined
            } else {
              callback(moment)
            }
          })
        }
      }

      return value
    },
  })

  return proxy
}

const ASYNC_INTERFACE_PROXY_CALL_FILTER: AllKeys<
  AllTypes<any>,
  Dict<string>
> = {
  V: { $write: 'write' },
  J: { $set: 'set' },
  CA: { $draw: 'draw' },
  G: ASYNC_GRAPH_PROXY_CALL_FILTER,
  // TODO
  B: {},
  IB: {},
  CC: {},
  C: {},
  CS: {},
  CO: {},
  GP: {},
  M: {},
  E: {},
  EE: {},
  BD: {},
  BS: {},
  BSE: {},
  BC: {},
  NO: {},
  A: {},
  PP: {},
  PS: {},
  CH: {},
  ST: {},
  S: {},
  U: {},
  TR: {},
  RE: {},
  F: {},
  L: {},
}

const ASYNC_INTERFACE_PROXY_WATCH_FILTER: Dict<Set<string>> = {
  G: ASYNC_GRAPH_PROXY_WATCH_FILTER,
}

export function proxyWrap<T extends object>(unit: T, _: string[] = []): T {
  let CALL = {}
  let WATCH = new Set<string>()

  for (const __ of _) {
    const CALL_FILTER = ASYNC_INTERFACE_PROXY_CALL_FILTER[__] || {}
    const WATCH_FILTER = ASYNC_INTERFACE_PROXY_WATCH_FILTER[__] || new Set()

    CALL = { ...CALL, ...CALL_FILTER }
    WATCH = new Set([...WATCH, ...WATCH_FILTER])
  }

  return proxy(unit, CALL, WATCH)
}
