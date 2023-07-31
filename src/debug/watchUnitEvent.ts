import { Element_ } from '../Class/Element'
import { Graph } from '../Class/Graph'
import { Stateful } from '../Class/Stateful'
import { Unit } from '../Class/Unit'
import { stringify } from '../spec/stringify'
import { EE } from '../types/interface/EE'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { ComponentAppendChildMoment } from './ComponentAppendChildMoment'
import { ComponentRemoveChildAtMoment } from './ComponentRemoveChildAtMoment'
import { UnitMoment } from './UnitMoment'
import { UnitRenamePinMoment } from './UnitRenamePinMoment'

export function watchUnitEvent(
  event: 'destroy' | 'reset' | 'listen' | 'unlisten',
  unit: Unit,
  callback: (moment: UnitMoment) => void
): () => void {
  const listener = (data) => {
    callback({
      type: 'unit',
      event,
      data,
    } as UnitMoment)
  }
  unit.addListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}

export function watchUnitRenamePinEvent(
  event: 'rename_input' | 'rename_output',
  unit: Unit,
  callback: (moment: UnitRenamePinMoment) => void
): () => void {
  const listener = (name: string, newName: string) => {
    callback({
      type: 'unit',
      event,
      data: {
        name,
        newName,
      },
    })
  }
  unit.addListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}

export function watchStatefulSetEvent(
  event: 'set',
  unit: Stateful,
  callback: (moment) => void
): () => void {
  const listener = (name, data) => {
    data = data !== undefined ? stringify(data) : data

    callback({
      type: 'unit',
      event,
      data: { name, data },
    })
  }

  unit.addListener(event, listener)

  return () => {
    unit.removeListener(event, listener)
  }
}

export function watchElementCallEvent(
  event: 'call',
  unit: Element_,
  callback: (moment) => void
): () => void {
  const listener = (data) => {
    callback({
      type: 'unit',
      event,
      data,
    })
  }
  unit.addListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}

export function watchComponentAppendEvent(
  event: 'append_child',
  unit: EE<{ append_child: [UnitBundleSpec, string[]] }>,
  callback: (moment: ComponentAppendChildMoment) => void
): () => void {
  const listener = (bundle: UnitBundleSpec, path: string[]) => {
    if (path.length > 0) {
      return
    }

    callback({
      type: 'unit',
      event,
      data: bundle,
      path,
    })
  }
  unit.addListener(event, listener)
  return () => {
    unit.removeListener(event, listener)
  }
}

export function watchComponentRemoveEvent(
  event: 'remove_child',
  unit: Graph | Element_,
  callback: (moment: ComponentRemoveChildAtMoment) => void
): () => void {
  const listener = (at: number, path: string[]) => {
    if (path.length > 0) {
      return
    }

    callback({
      type: 'unit',
      event,
      data: at,
      path,
    })
  }
  // @ts-ignore
  unit.addListener(event, listener)
  return () => {
    // @ts-ignore
    unit.removeListener(event, listener)
  }
}
