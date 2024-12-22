import { camelToSnake, snakeToCamel } from './client/id'
import { METHOD, METHOD_TYPES, MethodType } from './client/method'
import { $map } from './constant/$map'
import { Moment } from './debug/Moment'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import { Unlisten } from './types/Unlisten'
import { mapObjKV, mapObjVK } from './util/object'

export function proxy<T extends object>(
  obj: T,
  filters: Record<MethodType, Set<string>>
): T {
  let stop_event: string = undefined
  let stop_depth: number = 0

  function attach<T extends object>(
    obj: T,
    filters: Record<MethodType, Set<string>>,
    depth: number
  ) {
    const { call, watch, ref } = filters

    return new Proxy(obj, {
      get: (target, name: string) => {
        if (name === '__wrapped') {
          return true
        }

        const value = target[name]

        if (call.has(name)) {
          return (...args: any[]) => {
            stop_event = camelToSnake(name.slice(1))
            stop_depth = depth

            return value.call(target, ...args)
          }
        } else if (watch.has(name)) {
          return (data: any, callback: Callback<any>): Unlisten => {
            return value.call(target, data, (moment: Moment) => {
              const { event } = moment

              const path = moment.data?.path

              if (path) {
                if (stop_event) {
                  if (!call.has(`$${snakeToCamel(event)}`)) {
                    callback(moment)

                    return
                  }

                  if (stop_event === event) {
                    if (path.length === stop_depth) {
                      stop_event = undefined
                      stop_depth = 0
                    }
                  }
                } else {
                  callback(moment)
                }
              } else {
                if (stop_event) {
                  if (stop_event === event && stop_depth === depth) {
                    stop_event = undefined

                    return
                  }
                }

                callback(moment)
              }
            })
          }
        } else if (ref.has(name)) {
          return (data: Dict<any>) => {
            const { detached = true } = data

            stop_depth = depth + 1

            const $ref = value.call(target, data)

            if ($ref.__wrapped) {
              return $ref
            }

            const filters = interfaceFilters($ref.__)

            if (detached) {
              return proxy($ref, filters)
            } else {
              return attach($ref, filters, depth + 1)
            }
          }
        }

        return value
      },
    })
  }

  return attach(obj, filters, 0)
}

const $set = (array: string[]) => {
  return new Set(array.map($map))
}

const ASYNC_FILTER = mapObjKV(METHOD, (__, filter) => mapObjVK(filter, $set))

const _interface_filter_cache: Dict<Record<MethodType, Set<string>>> = {}

export function interfaceFilters(
  _: string[] = []
): Record<MethodType, Set<string>> {
  const id = _.sort().join('-')

  let filter = _interface_filter_cache[id]

  if (filter) {
    return filter
  }

  filter = {
    get: new Set(),
    call: new Set(),
    watch: new Set(),
    ref: new Set(),
  }

  for (const __ of _) {
    for (const type of METHOD_TYPES) {
      const FILTER = ASYNC_FILTER[__][type]

      for (const name of FILTER) {
        filter[type].add(name)
      }
    }
  }

  _interface_filter_cache[id] = filter

  return filter
}

export function proxyWrap<T extends object>(obj: T, _: string[] = []): T {
  const filters = interfaceFilters(_)

  return proxy(obj, filters)
}
