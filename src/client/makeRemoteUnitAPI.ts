import { Dict } from '../types/Dict'
import {
  C_METHOD_CALL,
  C_METHOD_REF,
  C_METHOD_WATCH,
} from '../types/interface/async/$C'
import {
  G_METHOD_CALL,
  G_METHOD_REF,
  G_METHOD_WATCH,
} from '../types/interface/async/$G'
import {
  U_METHOD_CALL,
  U_METHOD_REF,
  U_METHOD_WATCH,
} from '../types/interface/async/$U'
import {
  AsyncCCall,
  AsyncCRef,
  AsyncCWatch,
} from '../types/interface/async/AsyncC'
import {
  AsyncGCall,
  AsyncGRef,
  AsyncGWatch,
} from '../types/interface/async/AsyncG'
import {
  AsyncJCall,
  AsyncJRef,
  AsyncJWatch,
} from '../types/interface/async/AsyncJ'
import {
  AsyncSCall,
  AsyncSRef,
  AsyncSWatch,
} from '../types/interface/async/AsyncS'
import {
  AsyncSTCall,
  AsyncSTRef,
  AsyncSTWatch,
} from '../types/interface/async/AsyncST'
import {
  AsyncUCall,
  AsyncURef,
  AsyncUWatch,
} from '../types/interface/async/AsyncU'
import {
  AsyncVCall,
  AsyncVRef,
  AsyncVWatch,
} from '../types/interface/async/AsyncV'
import { RemoteAPI } from './RemoteAPI'

// TODO
const METHOD: Dict<Record<'call' | 'watch' | 'ref', string[]>> = {
  G: {
    call: G_METHOD_CALL,
    watch: G_METHOD_WATCH,
    ref: G_METHOD_REF,
  },
  U: {
    call: U_METHOD_CALL,
    watch: U_METHOD_WATCH,
    ref: U_METHOD_REF,
  },
  C: {
    call: C_METHOD_CALL,
    watch: C_METHOD_WATCH,
    ref: C_METHOD_REF,
  },
}

export function remoteRef(ref: object): RemoteAPI['ref'] {
  let _ref: RemoteAPI['ref'] = {}

  for (const name in ref) {
    const method = ref[name]

    const _method = (data: any): RemoteAPI => {
      const { _ } = data

      const $unit = method(data)

      if (Array.isArray($unit)) {
      }

      const remoteApi: RemoteAPI = {
        call: {},
        watch: {},
        ref: {},
      }

      for (const __ of _) {
        const methods = METHOD[__]

        for (const type of ['call', 'watch', 'ref']) {
          const methodList = methods[type]

          for (const methodName of methodList) {
            const $methodName = `$${methodName}`

            remoteApi[type][$methodName] = (...args) => {
              return $unit[$methodName](...args)
            }
          }
        }
      }

      return remoteApi
    }

    _ref[name] = _method
  }

  return _ref
}

export function makeRemoteUnitAPI(unit: any, _: string[]): RemoteAPI {
  let call = {}
  let watch = {}
  let ref = {}

  for (const __ of _) {
    switch (__) {
      case 'U':
        call = { ...call, ...AsyncUCall(unit) }
        watch = { ...watch, ...AsyncUWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncURef(unit)) }
        break
      case 'C':
        call = { ...call, ...AsyncCCall(unit) }
        watch = { ...watch, ...AsyncCWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncCRef(unit)) }
        break
      case 'G':
        call = { ...call, ...AsyncGCall(unit) }
        watch = { ...watch, ...AsyncGWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncGRef(unit)) }
        break
      case 'V':
        call = { ...call, ...AsyncVCall(unit) }
        watch = { ...watch, ...AsyncVWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncVRef(unit)) }
        break
      case 'J':
        call = { ...call, ...AsyncJCall(unit) }
        watch = { ...watch, ...AsyncJWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncJRef(unit)) }
        break
      case 'ST':
        call = { ...call, ...AsyncSTCall(unit) }
        watch = { ...watch, ...AsyncSTWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncSTRef(unit)) }
        break
      case 'S':
        call = { ...call, ...AsyncSCall(unit) }
        watch = { ...watch, ...AsyncSWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncSRef(unit)) }
        break
      default:
        throw new Error('unknown interface')
    }
  }

  const API: RemoteAPI = {
    call,
    watch,
    ref,
  }

  return API
}
