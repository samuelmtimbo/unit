import { Callback } from './Callback'
import { ASYNC_GRAPH_PROXY_CALL_FILTER } from './constant/ASYNC_GRAPH_PROXY_CALL_FILTER'
import { ASYNC_GRAPH_PROXY_WATCH_FILTER } from './constant/ASYNC_GRAPH_PROXY_WATCH_FILTER'
import { Moment } from './debug/Moment'
import { Dict } from './types/Dict'
import { Unlisten } from './Unlisten'

export function proxy<T extends object>(
  unit: T,
  CALL: Dict<string>,
  WATCH: Set<string>
): T {
  let stop_event: string = undefined

  const proxy = new Proxy(unit, {
    get: (target, name: string) => {
      const value = target[name]
      // if (typeof value == 'function') {
      if (CALL[name]) {
        stop_event = CALL[name]
      } else if (WATCH.has(name)) {
        return (data: any, callback: Callback<any>): Unlisten => {
          return value.call(target, data, (moment: Moment) => {
            const { event } = moment
            if (stop_event === event) {
              stop_event = undefined
            } else {
              callback(moment)
            }
          })
        }
      }
      // }
      return value
    },
  })

  return proxy
}

const ASYNC_INTERFACE_PROXY_CALL_FILTER: Dict<Dict<string>> = {
  $V: { $write: 'write' },
  $J: { $set: 'set' },
  $CA: { $draw: 'draw' },
  $G: ASYNC_GRAPH_PROXY_CALL_FILTER,
}

export function proxyWrap<T extends object>(unit: T, _: string[] = []): T {
  let CALL = {}

  for (const __ of _) {
    const CALL_FILTER = ASYNC_INTERFACE_PROXY_CALL_FILTER[__] || {}
    CALL = { ...CALL, ...CALL_FILTER }
  }

  return proxy(unit, CALL, new Set(ASYNC_GRAPH_PROXY_WATCH_FILTER))
}
