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
import { appendChild, Context, mount } from '../context'
import { renderFrame } from '../renderFrame'

export function renderGraph(
  root: HTMLElement,
  system: System,
  context: Context | null,
  $graph: $Graph
): Unlisten {
  let unlisten: Unlisten = NOOP

  $graph.$getBundle({ deep: true }, async (bundle: BundleSpec) => {
    const { spec, specs } = clone(bundle)

    const specs_ = weakMerge(specs ?? {}, system.specs)

    for (const unitId in spec.units) {
      const unit = spec.units[unitId]

      evaluateMemorySpec(unit.memory, specs_, system.classes)
    }

    const context_ = renderFrame(system, context, root)
    const component = componentFromSpec(system, spec, specs_)

    const disconnect = component.connect($graph, true)
    const unrender = appendChild(context_, component)
    const unmount = mount(context_)

    component.focus()

    unlisten = callAll([unmount, unrender, disconnect])
  })

  return unlisten
}
