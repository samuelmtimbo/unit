import callAll from '../../callAll'
import { $PO } from '../../interface/async/$PO'
import NOOP from '../../NOOP'
import { System } from '../../system'
import { GraphSpec } from '../../types'
import { Unlisten } from '../../Unlisten'
import { componentFromSpec } from '../componentFromSpec'
import { enterFullwindow, focusContext, mount as _mount } from '../context'
import { renderFrame } from '../renderFrame'
import { watchPodComponent } from './watchPodComponent'

export function renderPod(
  $system: System,
  $root: HTMLElement,
  pod: $PO
): Unlisten {
  // console.log('renderPod')
  let unlisten: Unlisten = NOOP

  const $graph = pod.$graph({})

  $graph.$getSpec({}, (spec: GraphSpec) => {
    const component = componentFromSpec($system, spec)

    const $$context = renderFrame($system, null, $root, {})

    const unlisten_fullwindow = enterFullwindow($$context, component)

    _mount($$context)

    const unlisten_pod = watchPodComponent($system, $graph, component)

    component.connect($graph)

    focusContext($$context)

    unlisten = callAll([unlisten_fullwindow, unlisten_pod])
  })

  return unlisten
}
