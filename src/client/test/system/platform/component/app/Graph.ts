import { boot } from '../../../../../../boot'
import { Graph } from '../../../../../../Class/Graph'
import { Async } from '../../../../../../interface/async/Async'
import { spawn } from '../../../../../../spawn'
import GraphComponent from '../../../../../../system/platform/component/app/Graph/Component'
import { nodeHost } from '../../../../../platform/node/host'

export const system = boot({
  api: nodeHost(),
})

export const pod = spawn(system)

const graph = new Graph({}, {}, system, pod)

const $graph = Async(graph, ['$U', '$G', '$C', '$EE'])

const graph_comp = new GraphComponent(
  {
    pod: $graph,
  },
  system,
  pod
)
