import { RemoteRef } from './RemoteRef'
import { makeRemoteUnitAPI } from './makeRemoteUnitAPI'

export function makeUnitRemoteRef(
  unit: any,
  _: string[],
  post: (data: any) => void
): RemoteRef {
  const API = makeRemoteUnitAPI(unit, _)

  const remoteRef = new RemoteRef(API, post)

  return remoteRef
}
