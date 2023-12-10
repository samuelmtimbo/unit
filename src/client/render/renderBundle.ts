import { render } from '.'
import { API } from '../../API'
import { boot } from '../../boot'
import { noHost } from '../../host/none'
import { start } from '../../start'
import { BootOpt, System } from '../../system'
import { BundleSpec } from '../../types/BundleSpec'
import { AsyncGraph } from '../../types/interface/async/AsyncGraph'

export function renderBundle(
  bundle: BundleSpec,
  opt?: BootOpt,
  api: API = noHost()
): System {
  // console.log('renderBundle')

  const system = boot(null, noHost(), opt)
  const graph = start(system, bundle)
  const $graph = AsyncGraph(graph)

  render(system, $graph)

  return system
}
