import { Element } from '../Class/Element'
import { Graph } from '../Class/Graph'
import { Stateful } from '../Class/Stateful'
import { Unit } from '../Class/Unit'
import { EE } from '../interface/EE'
import { UnitBundleSpec } from '../system/platform/method/process/UnitBundleSpec'
import { ComponentAppendChildMoment } from './ComponentAppendChildMoment'
import { ComponentRemoveChildAtMoment } from './ComponentRemoveChildAtMoment'
import { UnitMoment } from './UnitMoment'

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

export function watchStatefulSetEvent(
  event: 'set',
  unit: Stateful,
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

export function watchElementCallEvent(
  event: 'call',
  unit: Element,
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

export function watchStatefulLeafSetEvent(
  event: 'leaf_set',
  unit: Stateful,
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

export function watchComponentAppendEvent(
  event: 'append_child',
  unit: EE<{ append_child: [UnitBundleSpec] }>,
  callback: (moment: ComponentAppendChildMoment) => void
): () => void {
  const listener = (data: UnitBundleSpec) => {
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

export function watchComponentRemoveEvent(
  event: 'remove_child_at',
  unit: Graph | Element,
  callback: (moment: ComponentRemoveChildAtMoment) => void
): () => void {
  const listener = (data) => {
    callback({
      type: 'unit',
      event,
      data,
    })
  }
  // @ts-ignore
  unit.addListener(event, listener)
  return () => {
    // @ts-ignore
    unit.removeListener(event, listener)
  }
}

export function watchComponentLeafAppendEvent(
  event: 'leaf_append_child',
  unit: Graph | Element,
  callback: (moment: UnitMoment) => void
): () => void {
  const listener = (data) => {
    callback({
      type: 'unit',
      event,
      data,
    })
  }
  // @ts-ignore
  unit.addListener(event, listener)
  return () => {
    // @ts-ignore
    unit.removeListener(event, listener)
  }
}

export function watchComponentLeafRemoveEvent(
  event: 'leaf_remove_child_at',
  unit: Graph | Element,
  callback: (moment: UnitMoment) => void
): () => void {
  const listener = (data) => {
    callback({
      type: 'unit',
      event,
      data,
    })
  }
  // @ts-ignore
  unit.addListener(event, listener)
  return () => {
    // @ts-ignore
    unit.removeListener(event, listener)
  }
}
