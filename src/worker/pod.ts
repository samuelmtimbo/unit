import { boot } from '../boot'
import { Graph } from '../Class/Graph'
import { makeRemoteUnitAPI } from '../client/makeRemoteUnitAPI'
import { RemoteRef } from '../client/RemoteRef'
import { init } from '../client/service'
import { spawn } from '../spawn'
import { BundleSpec } from '../system/platform/method/process/BundleSpec'

const post = (data) => {
  postMessage(data, null)
}

let _graph: Graph

const system = boot()

const pod = spawn(system)

init((data: BundleSpec) => {
  const { spec: spec, specs } = data

  for (const id in specs) {
    const _spec = specs[id]
    globalThis.__specs[id] = _spec
  }

  if (_graph) {
    _graph.destroy()
  }

  _graph = new Graph(spec, {}, system, pod)

  _graph.play()

  const api = makeRemoteUnitAPI(_graph, ['$U', '$C', '$G'])

  const ref = new RemoteRef(api, post)

  return ref
})
