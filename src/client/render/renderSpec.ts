import { render } from '.'
import { BootOpt, System } from '../../system'
import { boot } from '../../boot'
import { GraphSpec } from '../../types'

export function renderSpec(
  $root: HTMLElement,
  spec: GraphSpec,
  opt: BootOpt
): System {
  // console.log('renderSpec')

  const $system = boot({ spec, specs: {} }, opt)

  render($system, $root)

  return $system
}
