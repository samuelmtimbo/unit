import { NOOP } from '../../NOOP'
import { System } from '../../system'
import Frame from '../../system/platform/component/Frame/Component'
import { GraphSpec } from '../../types/GraphSpec'
import { BundleSpec } from '../../types/BundleSpec'
import { $Graph } from '../../types/interface/async/$Graph'
import { Unlisten } from '../../types/Unlisten'
import { weakMerge } from '../../types/weakMerge'
import { callAll } from '../../util/call/callAll'
import { componentFromSpec } from '../componentFromSpec'
import { appendChild, mount } from '../context'
import { renderFrame } from '../renderFrame'
import { watchGraphComponent } from './watchGraphComponent'

export function renderGraph(
  root: HTMLElement,
  system: System,
  $graph: $Graph
): Unlisten {
  // console.log('renderGraph')

  let unlisten: Unlisten = NOOP

  $graph.$getBundle({}, (bundle: BundleSpec) => {
    const { spec } = bundle

    const component = componentFromSpec(
      system,
      spec,
      weakMerge(system.specs, bundle.specs ?? {})
    )

    const context = renderFrame(system, null, root, {})

    const frame = new Frame({}, system)

    frame.appendChild(component)

    root.appendChild(frame.$element)

    const remove_child = appendChild(context, frame)

    mount(context)

    const unlisten_graph = watchGraphComponent(system, $graph, component)

    component.connect($graph)

    component.focus()

    unlisten = callAll([remove_child, unlisten_graph])
  })

  return unlisten
}
