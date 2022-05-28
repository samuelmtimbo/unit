import { render } from '.'
import { boot } from '../../boot'
import { spawn, start } from '../../spawn'
import { BootOpt, System } from '../../system'
import { BundleSpec } from '../../types/BundleSpec'
import { AsyncGraph } from '../../types/interface/async/AsyncGraph'

export function renderBundle(bundle: BundleSpec, opt: BootOpt): System {
  // console.log('renderBundle')

  const system = boot(opt)
  const pod = spawn(system)
  const graph = start(system, pod, bundle)
  const $graph = AsyncGraph(graph)

  render(system, pod, $graph)

  return system
}
