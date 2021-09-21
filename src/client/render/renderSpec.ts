import { render } from '.'
import { boot, BootOpt, System } from '../../boot'
import { GraphSpec } from '../../types'

export function renderSpec(
  $root: HTMLElement,
  spec: GraphSpec,
  opt: BootOpt
): System {
  // console.log('renderSpec')
  const $system = boot(spec, opt)
  render($system, $root)
  return $system
}
