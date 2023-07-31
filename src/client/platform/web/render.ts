import { Graph } from '../../../Class/Graph'
import { start } from '../../../start'
import { BootOpt, System } from '../../../system'
import { BundleSpec } from '../../../types/BundleSpec'
import { AsyncGraph } from '../../../types/interface/async/AsyncGraph'
import { Unlisten } from '../../../types/Unlisten'
import { callAll } from '../../../util/call/callAll'
import { render } from '../../render'
import webBoot from './boot'
import webInit from './init'

export default function webRender(
  bundle: BundleSpec,
  bootOpt: BootOpt = {}
): [Graph, System, Unlisten] {
  const { spec = {}, specs } = bundle

  const system = webBoot({
    specs,
    ...bootOpt,
  })

  if (!spec.id || !system.hasSpec(spec.id)) {
    system.newSpec(spec)
  }

  const graph = start(system, spec)

  const $graph = AsyncGraph(graph)

  const webUnlisten = webInit(system, window, system.root)
  const renderUnlisten = render(system, $graph)

  const unlisten = callAll([webUnlisten, renderUnlisten])

  return [graph, system, unlisten]
}
