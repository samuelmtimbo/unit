import { boot } from '../boot'
import { Graph } from '../Class/Graph'
import { makeRemoteUnitAPI } from '../client/makeRemoteUnitAPI'
import { RemoteRef } from '../client/RemoteRef'
import { init } from '../client/service'
import { start } from '../start'
import { GraphSpec } from '../types'

const post = (data) => {
  postMessage(data, null)
}

let _graph: Graph

const system = boot()

init((spec: GraphSpec) => {
  const graph = start(system, spec)

  if (_graph) {
    _graph.destroy()
  }

  _graph = graph

  _graph.play()

  const api = makeRemoteUnitAPI(_graph, ['$U', '$C', '$G'])

  const ref = new RemoteRef(api, post)

  return ref
})
