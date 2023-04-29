import { $makeRemoteUnitAPI } from './remote/$makeRemoteUnitAPI'
import { RemoteRef } from './RemoteRef'

export function makeUnitRemoteRef(
  unit: any,
  _: string[],
  post: (data: any) => void
): RemoteRef {
  const API = $makeRemoteUnitAPI(unit, _)

  const remoteRef = new RemoteRef(API, post)

  return remoteRef
}
