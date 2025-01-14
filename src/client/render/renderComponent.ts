import { NOOP } from '../../NOOP'
import { System } from '../../system'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { Unlisten } from '../../types/Unlisten'
import { $Component } from '../../types/interface/async/$Component'
import { callAll } from '../../util/call/callAll'
import { weakMerge } from '../../weakMerge'
import { Component } from '../component'
import { componentFromUnitSpec } from '../componentFromUnitSpec'
import { appendChild, Context, mount, unmount } from '../context'
import { renderFrame } from '../renderFrame'

export function $renderComponent(
  system: System,
  context: Context,
  root: HTMLElement,
  $component: $Component,
  callback: (component: Component) => void = NOOP
): Unlisten {
  let unlisten: Unlisten = NOOP

  $component.$getUnitBundleSpec({}, (bundle: UnitBundleSpec) => {
    const { unit } = bundle

    const specs = weakMerge(system.specs, bundle.specs ?? {})

    const component = componentFromUnitSpec(system, specs, unit)

    unlisten = renderComponent(system, context, root, component)

    component.connect($component as $Component)

    callback(component)
  })

  return unlisten
}

export function renderComponent(
  system: System,
  context: Context | null,
  root: HTMLElement,
  component: Component
): Unlisten {
  let unlisten: Unlisten = NOOP

  const context_ = renderFrame(system, context, root, {})

  const removeChild = appendChild(context_, component)

  mount(context_)

  unlisten = callAll([
    () => {
      unmount(context_)
    },
    removeChild,
  ])

  return unlisten
}
