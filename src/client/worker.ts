import { Graph } from '../Class/Graph'
import { Bundle } from '../system/platform/method/process/WorkerPod'
import globals from './globals'
import { makeRemoteUnitAPI } from './makeRemoteUnitAPI'
import { RemoteRef } from './RemoteRef'
import { init } from './service'

globals()

const post = (data) => {
  postMessage(data, null)
}

let _graph: Graph

init((data: Bundle) => {
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
