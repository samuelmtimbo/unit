import { Graph } from '../../../Class/Graph'
import { evaluateBundleSpec } from '../../../spec/evaluate/evaluateBundleSpec'
import { start } from '../../../start'
import { BootOpt, System } from '../../../system'
import { BundleSpec } from '../../../types/BundleSpec'
import { Unlisten } from '../../../types/Unlisten'
import { AsyncGraph } from '../../../types/interface/async/AsyncGraph'
import { callAll } from '../../../util/call/callAll'
import { render as render_ } from '../../render'
import { defaultWebBoot, webBoot } from './boot'
import { webInit } from './init'

export function render(
  bundle: BundleSpec,
  opt?: BootOpt
): [System, Graph, Unlisten] {
  const { spec = {}, specs = {} } = bundle

  bundle.spec = spec
  bundle.specs = specs

  const [system, deboot] = defaultWebBoot({
    env: {
      HOSTNAME: 'localhost',
      ...opt?.env,
    },
    specs,
    ...opt,
  })

  evaluateBundleSpec(bundle, system.specs, system.classes)

  const graph = start(system, bundle)

  const $graph = AsyncGraph(graph)

  const deinit = webInit(system, window, system.root)

  const unrender = render_(system, $graph)

  const destroy = callAll([deinit, unrender, deboot])

  return [system, graph, destroy]
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

  const unlistenRender = render_(system, $graph)

  const unlisten = callAll([unlistenRender, unlistenSystem])

  return [system, graph, unlisten]
}
