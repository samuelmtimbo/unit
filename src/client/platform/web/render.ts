import { Graph } from '../../../Class/Graph'
import { start } from '../../../start'
import { BootOpt, System } from '../../../system'
import _classes from '../../../system/_classes'
import _components from '../../../system/_components'
import _specs from '../../../system/_specs'
import { BundleSpec } from '../../../types/BundleSpec'
import { Unlisten } from '../../../types/Unlisten'
import { AsyncGraph } from '../../../types/interface/async/AsyncGraph'
import { callAll } from '../../../util/call/callAll'
import { weakMerge } from '../../../weakMerge'
import { render as _render } from '../../render'
import { defaultWebBoot, webBoot } from './boot'
import { webInit } from './init'

export function render(
  bundle: BundleSpec,
  bootOpt?: BootOpt
): [Graph, System, Unlisten] {
  const { spec = {}, specs = {} } = bundle

  bundle.spec = spec
  bundle.specs = specs

  const [system, unlistenSystem] = defaultWebBoot({
    specs: weakMerge(specs, _specs),
    classes: _classes,
    components: _components,
    ...bootOpt,
  })

  if (!spec.id || !system.hasSpec(spec.id)) {
    system.newSpec(spec)
  }

  const graph = start(system, bundle)

  const $graph = AsyncGraph(graph)

  const webUnlisten = webInit(system, window, system.root)
  const renderUnlisten = _render(system, $graph)

  const unlisten = callAll([webUnlisten, renderUnlisten, unlistenSystem])

  return [graph, system, unlisten]
}

export function renderBundle(
  root: HTMLElement,
  bundle: BundleSpec,
  opt?: BootOpt
): [System, Graph, Unlisten] {
  // console.log('renderBundle')

  const [system, unlistenSystem] = webBoot(window, root, opt)
  const graph = start(system, bundle)
  const $graph = AsyncGraph(graph)

  const unlistenRender = _render(system, $graph)

  const unlisten = callAll([unlistenRender, unlistenSystem])

  return [system, graph, unlisten]
}
