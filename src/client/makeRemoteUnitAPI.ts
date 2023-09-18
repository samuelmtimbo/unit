import { Dict } from '../types/Dict'
import {
  C_METHOD_CALL,
  C_METHOD_REF,
  C_METHOD_WATCH,
} from '../types/interface/async/$C'
import {
  CA_METHOD_CALL,
  CA_METHOD_REF,
  CA_METHOD_WATCH,
} from '../types/interface/async/$CA'
import {
  EE_METHOD_CALL,
  EE_METHOD_REF,
  EE_METHOD_WATCH,
} from '../types/interface/async/$EE'
import {
  G_METHOD_CALL,
  G_METHOD_REF,
  G_METHOD_WATCH,
} from '../types/interface/async/$G'
import {
  J_METHOD_CALL,
  J_METHOD_REF,
  J_METHOD_WATCH,
} from '../types/interface/async/$J'
import {
  MS_METHOD_CALL,
  MS_METHOD_REF,
  MS_METHOD_WATCH,
} from '../types/interface/async/$MS'
import {
  S_METHOD_CALL,
  S_METHOD_REF,
  S_METHOD_WATCH,
} from '../types/interface/async/$S'
import {
  U_METHOD_CALL,
  U_METHOD_REF,
  U_METHOD_WATCH,
} from '../types/interface/async/$U'
import {
  V_METHOD_CALL,
  V_METHOD_REF,
  V_METHOD_WATCH,
} from '../types/interface/async/$V'
import {
  AsyncCCall,
  AsyncCRef,
  AsyncCWatch,
} from '../types/interface/async/AsyncC'
import {
  AsyncCACall,
  AsyncCARef,
  AsyncCAWatch,
} from '../types/interface/async/AsyncCA'
import {
  AsyncEECall,
  AsyncEERef,
  AsyncEEWatch,
} from '../types/interface/async/AsyncEE'
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
  AsyncMSCall,
  AsyncMSRef,
  AsyncMSWatch,
} from '../types/interface/async/AsyncMS'
import {
  AsyncSCall,
  AsyncSRef,
  AsyncSWatch,
} from '../types/interface/async/AsyncS'
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

const METHOD: Dict<Record<'call' | 'watch' | 'ref', string[]>> = {
  EE: {
    call: EE_METHOD_CALL,
    watch: EE_METHOD_WATCH,
    ref: EE_METHOD_REF,
  },
  U: {
    call: U_METHOD_CALL,
    watch: U_METHOD_WATCH,
    ref: U_METHOD_REF,
  },
  G: {
    call: G_METHOD_CALL,
    watch: G_METHOD_WATCH,
    ref: G_METHOD_REF,
  },
  C: {
    call: C_METHOD_CALL,
    watch: C_METHOD_WATCH,
    ref: C_METHOD_REF,
  },
  V: {
    call: V_METHOD_CALL,
    watch: V_METHOD_WATCH,
    ref: V_METHOD_REF,
  },
  J: {
    call: J_METHOD_CALL,
    watch: J_METHOD_WATCH,
    ref: J_METHOD_REF,
  },
  MS: {
    call: MS_METHOD_CALL,
    watch: MS_METHOD_WATCH,
    ref: MS_METHOD_REF,
  },
  S: {
    call: S_METHOD_CALL,
    watch: S_METHOD_WATCH,
    ref: S_METHOD_REF,
  },
  CA: {
    call: CA_METHOD_CALL,
    watch: CA_METHOD_WATCH,
    ref: CA_METHOD_REF,
  },
}

export function remoteRef(ref: object): RemoteAPI['ref'] {
  let _ref: RemoteAPI['ref'] = {}

  for (const name in ref) {
    const method = ref[name]

    const _method = (data: any): RemoteAPI => {
      const { _ } = data

      const $unit = method(data)

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
              const result = $unit[$methodName](...args)

              return type === 'ref'
                ? makeRemoteUnitAPI(result, result.__)
                : result
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
      case 'EE':
        call = { ...call, ...AsyncEECall(unit) }
        watch = { ...watch, ...AsyncEEWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncEERef(unit)) }
        break
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
      case 'MS':
        call = { ...call, ...AsyncMSCall(unit) }
        watch = { ...watch, ...AsyncMSWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncMSRef(unit)) }
        break
      case 'S':
        call = { ...call, ...AsyncSCall(unit) }
        watch = { ...watch, ...AsyncSWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncSRef(unit)) }
        break
      case 'CA':
        call = { ...call, ...AsyncCACall(unit) }
        watch = { ...watch, ...AsyncCAWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncCARef(unit)) }
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
