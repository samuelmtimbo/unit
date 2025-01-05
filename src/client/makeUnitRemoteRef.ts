import { RemoteRef } from './RemoteRef'
import { makeRemoteObjectAPI } from './makeRemoteUnitAPI'

export function makeUnitRemoteRef(
  unit: any,
  _: string[],
  post: (data: any) => void
): RemoteRef {
  const API = makeRemoteObjectAPI(unit, _)

  const remoteRef = new RemoteRef(API, post)

  return remoteRef
}
