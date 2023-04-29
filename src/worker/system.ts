import { boot } from '../boot'
import { makeRemoteUnitAPI } from '../client/makeRemoteUnitAPI'
import { RemoteRef } from '../client/RemoteRef'
import { init } from '../client/service'

const post = (data) => {
  postMessage(data, null)
}

const system = boot()

const api = makeRemoteUnitAPI(system, ['S'])

const ref = new RemoteRef(api, post)

init(() => {
  return ref
})
