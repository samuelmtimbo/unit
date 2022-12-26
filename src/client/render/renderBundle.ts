import { render } from '.'
import { boot } from '../../boot'
import { noHost } from '../../host/none'
import { start } from '../../start'
import { BootOpt, System } from '../../system'
import { BundleSpec } from '../../types/BundleSpec'
import { AsyncGraph } from '../../types/interface/async/AsyncGraph'

export function renderBundle(bundle: BundleSpec, opt: BootOpt): System {
  // console.log('renderBundle')

  const { spec, specs } = bundle // RETURN

  const system = boot(null, noHost(), opt)
  const graph = start(system, spec)
  const $graph = AsyncGraph(graph)

  render(system, $graph)

  return system
}
