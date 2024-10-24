import { NOOP } from '../../NOOP'
import { evaluateMemorySpec } from '../../spec/evaluate/evaluateMemorySpec'
import { System } from '../../system'
import Frame from '../../system/platform/component/Frame/Component'
import { BundleSpec } from '../../types/BundleSpec'
import { Unlisten } from '../../types/Unlisten'
import { $Graph } from '../../types/interface/async/$Graph'
import { callAll } from '../../util/call/callAll'
import { clone } from '../../util/clone'
import { weakMerge } from '../../weakMerge'
import { componentFromSpec } from '../componentFromSpec'
import { appendChild, mount, unmount } from '../context'
import { renderFrame } from '../renderFrame'

export function renderGraph(
  root: HTMLElement,
  system: System,
  $graph: $Graph
): Unlisten {
  // console.log('renderGraph')

  let unlisten: Unlisten = NOOP

  $graph.$getBundle({ deep: true }, async (bundle: BundleSpec) => {
    const { spec, specs } = clone(bundle)

    for (const unitId in spec.units) {
      const unit = spec.units[unitId]

      evaluateMemorySpec(
        unit.memory,
        weakMerge(specs, system.specs),
        system.classes
      )
    }

    const component = componentFromSpec(
      system,
      spec,
      weakMerge(system.specs, bundle.specs ?? {})
    )

    const context = renderFrame(system, null, root, {})

    const frame = new Frame({}, system)

    component.connect($graph)

    frame.appendChild(component)

    root.appendChild(frame.$element)

    const removeChild = appendChild(context, frame)

    mount(context)

    component.focus()

    const unlistenRender = () => {
      component.disconnect()

      frame.removeChild(component)

      unmount(context)
    }

    unlisten = callAll([removeChild, unlistenRender])
  })

  return unlisten
}
