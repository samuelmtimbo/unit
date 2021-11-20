import { Graph } from '../Class/Graph'
import globals from '../client/globals'
import { makeRemoteUnitAPI } from '../client/makeRemoteUnitAPI'
import { RemoteRef } from '../client/RemoteRef'
import { init } from '../client/service'
import { BundleSpec } from '../system/platform/method/process/BundleSpec'

globals()

const post = (data) => {
  postMessage(data, null)
}

let _graph: Graph

init((data: BundleSpec) => {
  const { spec, specs } = data

  for (const id in specs) {
    const _spec = specs[id]
    globalThis.__specs[id] = _spec
  }

  if (_graph) {
    _graph.destroy()
  }

  _graph = new Graph(spec)

  _graph.play()

  const api = makeRemoteUnitAPI(_graph, ['$U', '$C', '$G'])

  const ref = new RemoteRef(api, post)

  return ref
})
