import { AsyncCCall, AsyncCRef, AsyncCWatch } from '../async/AsyncC_'
import { AsyncGCall, AsyncGRef, AsyncGWatch } from '../async/AsyncG_'
import { AsyncJCall, AsyncJRef, AsyncJWatch } from '../async/AsyncJ_'
import { AsyncSTCall, AsyncSTRef, AsyncSTWatch } from '../async/AsyncST_'
import { AsyncUCall, AsyncURef, AsyncUWatch } from '../async/AsyncU_'
import { AsyncVCall, AsyncVRef, AsyncVWatch } from '../async/AsyncV_'
import { $makeRemoteUnitAPI } from './remote/$makeRemoteUnitAPI'
import { RemoteAPI } from './RemoteAPI'

export function remoteRef(ref: object): RemoteAPI['ref'] {
  let _ref: RemoteAPI['ref'] = {}

  for (const name in ref) {
    const method = ref[name]
    const _method = (data: any): RemoteAPI => {
      const { _ } = data
      const $unit = method(data)
      return $makeRemoteUnitAPI($unit, _)
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
      case '$U':
        call = { ...call, ...AsyncUCall(unit) }
        watch = { ...watch, ...AsyncUWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncURef(unit)) }
        break
      case '$C':
        call = { ...call, ...AsyncCCall(unit) }
        watch = { ...watch, ...AsyncCWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncCRef(unit)) }
        break
      case '$G':
        call = { ...call, ...AsyncGCall(unit) }
        watch = { ...watch, ...AsyncGWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncGRef(unit)) }
        break
      case '$V':
        call = { ...call, ...AsyncVCall(unit) }
        watch = { ...watch, ...AsyncVWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncVRef(unit)) }
        break
      case '$J':
        call = { ...call, ...AsyncJCall(unit) }
        watch = { ...watch, ...AsyncJWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncJRef(unit)) }
        break
      case '$ST':
        call = { ...call, ...AsyncSTCall(unit) }
        watch = { ...watch, ...AsyncSTWatch(unit) }
        ref = { ...ref, ...remoteRef(AsyncSTRef(unit)) }
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
