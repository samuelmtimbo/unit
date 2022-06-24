import { render } from '.'
import { boot } from '../../boot'
import { spawn, start } from '../../spawn'
import { BootOpt, System } from '../../system'
import { BundleSpec } from '../../types/BundleSpec'
import { AsyncGraph } from '../../types/interface/async/AsyncGraph'

export function renderBundle(bundle: BundleSpec, opt: BootOpt): System {
  // console.log('renderBundle')

  const { spec, specs } = bundle

  const system = boot(opt)
  const pod = spawn(system, specs)
  const graph = start(system, pod, spec)
  const $graph = AsyncGraph(graph)

  render(system, pod, $graph)

  return system
}
