import { NOOP } from '../../NOOP'
import { evaluateMemorySpec } from '../../spec/evaluate/evaluateMemorySpec'
import { System } from '../../system'
import { BundleSpec } from '../../types/BundleSpec'
import { Unlisten } from '../../types/Unlisten'
import { $Graph } from '../../types/interface/async/$Graph'
import { callAll } from '../../util/call/callAll'
import { clone } from '../../util/clone'
import { weakMerge } from '../../weakMerge'
import { componentFromSpec } from '../componentFromSpec'
import { Context } from '../context'
import { renderComponent } from './renderComponent'

export function renderGraph(
  root: HTMLElement,
  system: System,
  context: Context | null,
  $graph: $Graph
): Unlisten {
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

    const disconnect = component.connect($graph, true)

    const unrender = renderComponent(system, context, root, component)

    component.focus()

    unlisten = callAll([disconnect, unrender])
  })

  return unlisten
}
