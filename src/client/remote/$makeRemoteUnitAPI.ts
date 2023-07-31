import { RemoteAPI } from '../RemoteAPI'
import { makeRemoteUnitAPI } from '../makeRemoteUnitAPI'

export function $remoteRef(ref: object): RemoteAPI['ref'] {
  let _ref: RemoteAPI['ref'] = {}

  for (const name in ref) {
    const method = ref[name]

    const _method = (data: any): RemoteAPI => {
      const { _ } = data

      const $unit = method(data)

      if ($unit.__async) {
        return $unit
      }

      const remoteApi = makeRemoteUnitAPI($unit, _)

      return remoteApi
    }

    _ref[name] = _method
  }

  return _ref
}
