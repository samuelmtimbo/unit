import { boot } from '../boot'
import { Graph } from '../Class/Graph'
import { makeRemoteUnitAPI } from '../client/makeRemoteUnitAPI'
import { RemoteRef } from '../client/RemoteRef'
import { init } from '../client/service'
import { spawn, start } from '../spawn'
import { GraphSpec } from '../types'

const post = (data) => {
  postMessage(data, null)
}

let _graph: Graph

const system = boot()

const pod = spawn(system)

init((spec: GraphSpec) => {
  const graph = start(system, pod, spec)

  if (_graph) {
    _graph.destroy()
  }

  _graph = graph

  _graph.play()

  const api = makeRemoteUnitAPI(_graph, ['$U', '$C', '$G'])

  const ref = new RemoteRef(api, post)

  return ref
})
