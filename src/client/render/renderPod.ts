import { $Graph } from '../../interface/async/$Graph'
import { NOOP } from '../../NOOP'
import { Pod } from '../../pod'
import { System } from '../../system'
import { GraphSpec } from '../../types'
import { Unlisten } from '../../types/Unlisten'
import callAll from '../../util/call/callAll'
import { componentFromSpec } from '../componentFromSpec'
import { enterFullwindow, focusContext, mount as _mount } from '../context'
import { renderFrame } from '../renderFrame'
import { watchPodComponent } from './watchPodComponent'

export function renderGraph(
  root: HTMLElement,
  system: System,
  pod: Pod,
  $graph: $Graph
): Unlisten {
  // console.log('renderPod')

  let unlisten: Unlisten = NOOP

  $graph.$getSpec({}, (spec: GraphSpec) => {
    const component = componentFromSpec(system, pod, spec)

    const $$context = renderFrame(system, null, root, {})

    const unlisten_fullwindow = enterFullwindow($$context, component)

    _mount($$context)

    const unlisten_pod = watchPodComponent(system, pod, $graph, component)

    component.connect($graph)

    focusContext($$context)

    unlisten = callAll([unlisten_fullwindow, unlisten_pod])
  })

  return unlisten
}
