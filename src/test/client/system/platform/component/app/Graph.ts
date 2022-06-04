import { Graph } from '../../../../../../Class/Graph'
import { nodeBoot } from '../../../../../../client/platform/node/boot'
import { Async } from '../../../../../../types/interface/async/Async'
import { spawn } from '../../../../../../spawn'
import Editor from '../../../../../../system/platform/component/app/Editor/Component'

export const system = nodeBoot()

export const pod = spawn(system)

const graph = new Graph({}, {}, system, pod)

const $graph = Async(graph, ['$U', '$G', '$C', '$EE'])

const graph_comp = new Editor(
  {
    graph: $graph,
  },
  system,
  pod
)
