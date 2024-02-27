import { NOOP } from '../../NOOP'
import { System } from '../../system'
import Frame from '../../system/platform/component/Frame/Component'
import { BundleSpec } from '../../types/BundleSpec'
import { Unlisten } from '../../types/Unlisten'
import { $Graph } from '../../types/interface/async/$Graph'
import { callAll } from '../../util/call/callAll'
import { weakMerge } from '../../weakMerge'
import { componentFromSpec } from '../componentFromSpec'
import { appendChild, mount, unmount } from '../context'
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

    const removeChild = appendChild(context, frame)

    mount(context)

    const unlistenGraph = watchGraphComponent(system, $graph, component)

    component.connect($graph)

    component.focus()

    const unlistenRender = () => {
      component.disconnect()

      frame.removeChild(component)

      unmount(context)
    }

    unlisten = callAll([removeChild, unlistenGraph, unlistenRender])
  })

  return unlisten
}
