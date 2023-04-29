import { Graph } from '../../../../../../Class/Graph'
import { nodeBoot } from '../../../../../../client/platform/node/boot'
import { Async } from '../../../../../../types/interface/async/Async'

export const system = nodeBoot()

const graph = new Graph({}, {}, system)

const $graph = Async(graph, ['U', 'G', 'C', 'EE'])
