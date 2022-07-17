import { NOOP } from '../../NOOP'
import { Pod } from '../../pod'
import { System } from '../../system'
import Frame from '../../system/platform/component/Frame/Component'
import { GraphSpec } from '../../types'
import { $Graph } from '../../types/interface/async/$Graph'
import { Unlisten } from '../../types/Unlisten'
import callAll from '../../util/call/callAll'
import { componentFromSpec } from '../componentFromSpec'
import { appendChild, mount as _mount } from '../context'
import { renderFrame } from '../renderFrame'
import { watchPodComponent } from './watchPodComponent'

export function renderGraph(
  root: HTMLElement,
  system: System,
  pod: Pod,
  $graph: $Graph
): Unlisten {
  // console.log('renderGraph')

  let unlisten: Unlisten = NOOP

  $graph.$getSpec({}, (spec: GraphSpec) => {
    const component = componentFromSpec(system, pod, spec, {
      ...system.specs,
      ...pod.specs,
    })

    const $$context = renderFrame(system, null, root, {})

    const $frame = new Frame({}, system, pod)

    $frame.appendChild(component)

    root.appendChild($frame.$element)

    const remove_child = appendChild($$context, $frame)

    _mount($$context)

    const unlisten_pod = watchPodComponent(system, pod, $graph, component)

    component.connect($graph)

    component.focus()

    unlisten = callAll([remove_child, unlisten_pod])
  })

  return unlisten
}
