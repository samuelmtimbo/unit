import { render } from '.'
import { boot } from '../../boot'
import { AsyncGraph } from '../../interface/async/AsyncGraph'
import { spawn, start } from '../../spawn'
import { BootOpt, System } from '../../system'
import { BundleSpec } from '../../system/platform/method/process/BundleSpec'

export function renderBundle(
  root: HTMLElement,
  bundle: BundleSpec,
  opt: BootOpt
): System {
  // console.log('renderSpec')

  const __system = boot(opt)

  const __pod = spawn(__system)

  const _graph = start(__system, __pod, bundle)

  const $graph = AsyncGraph(_graph)

  render(root, __system, __pod, $graph)

  return __system
}
