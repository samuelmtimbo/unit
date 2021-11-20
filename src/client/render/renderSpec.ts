import { render } from '.'
import { BootOpt, System } from '../../system'
import { boot } from '../../boot'
import { GraphSpec } from '../../types'
import { spawn } from '../../spawn'

export function renderSpec(
  $root: HTMLElement,
  spec: GraphSpec,
  opt: BootOpt
): System {
  // console.log('renderSpec')

  const bundle = { spec, specs: {} }

  const system = boot(opt)

  const pod = spawn(system, bundle)

  render(system, pod, $root)

  return system
}
