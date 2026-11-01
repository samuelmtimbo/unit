import { boot } from '../boot'
import { RemoteRef } from '../client/RemoteRef'
import { makeRemoteObjectAPI } from '../client/makeRemoteUnitAPI'
import { workerApi } from '../client/platform/worker/boot'

const system = boot(null, workerApi())

const post = (data) => {
  globalThis.postMessage(data, null)
}

const api = makeRemoteObjectAPI(system, ['S'])

const ref = new RemoteRef(api, post)

globalThis.onmessage = function (event: MessageEvent) {
  const { data } = event

  ref.exec(data)
}
