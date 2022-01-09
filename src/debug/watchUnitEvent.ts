import { Element } from '../Class/Element'
import { Stateful } from '../Class/Stateful'
import { Unit } from '../Class/Unit'
import { C_EE } from '../interface/C'
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

export function watchComponentAppendEvent<T extends EE<C_EE>>(
  event: 'append_child',
  unit: T,
  callback: (moment: ComponentAppendChildMoment) => void
): () => void {
  const listener = (data: { bundle: UnitBundleSpec }) => {
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

export function watchComponentRemoveEvent<T extends EE<C_EE>>(
  event: 'remove_child_at',
  unit: T,
  callback: (moment: ComponentRemoveChildAtMoment) => void
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

export function watchComponentLeafAppendEvent<T extends EE<C_EE>>(
  event: 'leaf_append_child',
  unit: T,
  callback: (moment: UnitMoment) => void
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

export function watchComponentLeafRemoveEvent<T extends EE<C_EE>>(
  event: 'leaf_remove_child_at',
  unit: T,
  callback: (moment: UnitMoment) => void
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
