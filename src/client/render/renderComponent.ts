import { NOOP } from '../../NOOP'
import { System } from '../../system'
import Frame from '../../system/platform/component/Frame/Component'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { Unlisten } from '../../types/Unlisten'
import { $Component } from '../../types/interface/async/$Component'
import { $Graph } from '../../types/interface/async/$Graph'
import { callAll } from '../../util/call/callAll'
import { weakMerge } from '../../weakMerge'
import { componentFromUnitSpec } from '../componentFromUnitSpec'
import { appendChild, mount } from '../context'
import { renderFrame } from '../renderFrame'
import { getSpec } from '../spec'
import { watchGraphComponent } from './watchGraphComponent'

export function renderComponent(
  root: HTMLElement,
  system: System,
  $component: $Component
): Unlisten {
  // console.log('renderUnit')

  let unlisten: Unlisten = NOOP

  $component.$getUnitBundleSpec({}, (bundle: UnitBundleSpec) => {
    const { unit } = bundle

    const { id } = unit

    const specs = weakMerge(system.specs, bundle.specs ?? {})

    const component = componentFromUnitSpec(system, specs, unit)

    const spec = getSpec(specs, id)

    const { type = '`U`' } = spec

    const _ = type.split('&').map((type) => type.slice(1, -1))

    const context = renderFrame(system, null, root, {})

    const frame = new Frame({}, system)

    frame.appendChild(component)
    root.appendChild(frame.$element)

    const remove_child = appendChild(context, frame)

    mount(context)

    let unlisten_unit

    if (_.includes('G')) {
      unlisten_unit = watchGraphComponent(
        system,
        $component as $Graph,
        component
      )
    } else {
      unlisten_unit = NOOP
    }

    component.connect($component as $Component)

    component.focus()

    unlisten = callAll([remove_child, unlisten_unit])
  })

  return unlisten
}
