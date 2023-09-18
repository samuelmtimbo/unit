import { Unit } from '../../../Class/Unit'
import { Moment } from '../../../debug/Moment'
import { watchUnit } from '../../../debug/watchUnit'
import { getGlobalRef } from '../../../global'
import { proxyWrap } from '../../../proxyWrap'
import { evaluate } from '../../../spec/evaluate'
import { System } from '../../../system'
import { clone, mapObjVK } from '../../../util/object'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { GlobalRefSpec } from '../../GlobalRefSpec'
import { IO } from '../../IO'
import { stringifyPinData } from '../../stringifyPinData'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'
import { $U, $U_C, $U_R, $U_W } from './$U'
import { Async } from './Async'

export const $$refGlobalObj = (system: System, globalId: string) => {
  const $ = getGlobalRef(system, globalId)

  const $unit = Async($, $.__)

  return $unit
}

export const AsyncUCall = (unit: Unit<any, any, any>): $U_C => {
  return {
    $getGlobalId(data: {}, callback: Callback<string>): void {
      const __globalId = unit.getGlobalId()

      callback(__globalId)
    },

    $play(data: {}) {
      unit.play()
    },

    $pause(data: {}) {
      unit.pause()
    },

    $paused(data: {}, callback: Callback<boolean>): void {
      const paused = unit.paused()

      callback(paused)
    },

    $reset(data: {}): void {
      unit.reset()
    },

    $push({ pinId, data }: { pinId: string; data: any }): void {
      const { classes, specs } = unit.__system

      const _data = evaluate(data, specs, classes)

      unit.push(pinId, _data)
    },

    $takeInput(data: { path: string[]; pinId: string }): void {
      const { pinId } = data

      unit.takeInput(pinId)
    },

    $setPinData({ type, pinId, data }: { type: IO; pinId: string; data: any }) {
      const { classes, specs } = unit.__system

      const _data = evaluate(data, specs, classes)

      unit.setPinData(type, pinId, _data)
    },

    $removePinData(data: { type: IO; pinId: string }) {
      const { type, pinId } = data
      unit.removePinData(type, pinId)
    },

    $getPinData(
      data: {},
      callback: (data: { input: Dict<any>; output: Dict<any> }) => void
    ): void {
      const _data = unit.getPinsData()

      const __data = stringifyPinData(_data)

      callback(__data)
    },

    $getInputData(data: {}, callback: (data: Dict<any>) => void): void {
      const _data = unit.getInputData()
      callback(_data)
    },

    $getRefInputData(data: {}, callback: Callback<Dict<GlobalRefSpec>>): void {
      const _data = unit.getRefInputData()

      const __data = mapObjVK(_data, (unit: Unit) => {
        const __ = unit.getInterface()
        const globalId = unit.getGlobalId()

        return { globalId, __ }
      })

      callback(__data)
    },

    $getUnitBundleSpec(
      data: { deep: boolean },
      callback: Callback<UnitBundleSpec>
    ): void {
      const unitBundleSpec = unit.getUnitBundleSpec(data.deep)

      const $unitBundleSpec = clone(unitBundleSpec)

      callback($unitBundleSpec)
    },

    $pullInput(data: { pinId: string }): void {
      const { pinId } = data

      const input = unit.getInput(pinId)

      input.pull()
    },
  }
}

export const AsyncUWatch = (unit: Unit): $U_W => {
  return {
    $watch(
      { events }: { events: string[] },
      callback: (moment: Moment) => void
    ): Unlisten {
      return watchUnit(unit, callback, events)
    },
  }
}

export const AsyncURef = (unit: Unit): $U_R => {
  return {
    $refGlobalObj(data: GlobalRefSpec): $U {
      const __system = unit.refSystem()

      const { globalId } = data

      const $ = $$refGlobalObj(__system, globalId)

      return proxyWrap($, $.__)
    },
  }
}

export const AsyncU: (unit: Unit) => $U = (unit: Unit) => {
  return {
    ...AsyncUCall(unit),
    ...AsyncUWatch(unit),
    ...AsyncURef(unit),
  }
}
