import { $_ } from '../$_'
import { BundleOpt, Unit } from '../../../Class/Unit'
import {
  UnitDestroyData,
  UnitGetPinDataData,
  UnitHasPinData,
  UnitRestoreData,
} from '../../../Class/Unit/interface'
import { Memory } from '../../../Class/Unit/Memory'
import { DataRef } from '../../../DataRef'
import { Moment } from '../../../debug/Moment'
import { watchUnit } from '../../../debug/watchUnit'
import { getGlobalRef } from '../../../global'
import { evaluate } from '../../../spec/evaluate'
import { evaluateMemorySpec } from '../../../spec/evaluate/evaluateMemorySpec'
import { evaluateDataValue } from '../../../spec/evaluateDataValue'
import { resolveDataRef } from '../../../spec/resolveDataValue'
import { stringify } from '../../../spec/stringify'
import {
  stringifyMemorySpecData,
  stringifyUnitBundleSpecData,
} from '../../../spec/stringifySpec'
import { clone } from '../../../util/clone'
import { mapObjVK } from '../../../util/object'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { GlobalRefSpec } from '../../GlobalRefSpec'
import { IO } from '../../IO'
import { stringifyPinData } from '../../stringifyPinData'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'
import { $U, $U_C, $U_G, $U_R, $U_W } from './$U'
import { Async } from './Async'

export const AsyncUGet = (unit: Unit<any, any, any>): $U_G => {
  return {
    $getSpec(data, callback) {
      const spec = unit.getSpec()

      callback(spec)
    },

    $paused(data: {}, callback: Callback<boolean>): void {
      const paused = unit.paused()

      callback(paused)
    },

    async $snapshot(data: {}, callback: (state: Memory) => void) {
      const memory = unit.snapshot()

      stringifyMemorySpecData(memory)

      callback(memory)
    },

    $getPinData(
      { type, pinId }: UnitGetPinDataData,
      callback: (data: any) => void
    ): void {
      const _data = unit.getPinData(type, pinId)

      const __data = stringify(_data)

      callback(__data)
    },

    $getAllPinData(
      data: {},
      callback: (data: { input: Dict<any>; output: Dict<any> }) => void
    ): void {
      const _data = unit.getPinsData()

      const __data = stringifyPinData(_data)

      callback(__data)
    },

    $getAllInputData(data: {}, callback: (data: Dict<any>) => void): void {
      const _data = unit.getInputData()
      callback(_data)
    },

    $getAllRefInputData(
      data: {},
      callback: Callback<Dict<GlobalRefSpec>>
    ): void {
      const _data = unit.getRefInputData()

      const __data = mapObjVK(_data, (unit: Unit) => {
        const __ = unit.getInterface()
        const globalId = unit.getGlobalId()

        return { globalId, __ }
      })

      callback(__data)
    },

    $getUnitBundleSpec(
      data: BundleOpt,
      callback: Callback<UnitBundleSpec>
    ): void {
      const unitBundleSpec = unit.getUnitBundleSpec(data)

      stringifyUnitBundleSpecData(unitBundleSpec)

      const $unitBundleSpec = clone(unitBundleSpec)

      callback($unitBundleSpec)
    },

    $hasPin(data: UnitHasPinData, callback: Callback<boolean>) {
      const { type, pinId } = data

      const has = unit.hasPinNamed(type, pinId)

      callback(has)
    },
  }
}

export const AsyncUCall = (unit: Unit<any, any, any>): $U_C => {
  return {
    $play(data: {}) {
      unit.play()
    },

    $pause(data: {}) {
      unit.pause()
    },

    $reset(data: {}): void {
      unit.reset()
    },

    $push({ pinId, data }: { pinId: string; data: any }): void {
      const { classes, specs } = unit.__system

      const _data = evaluate(data, specs, classes)

      unit.push(pinId, _data)
    },

    $takeInput(data: { pinId: string }): void {
      const { pinId } = data

      unit.takeInput(pinId)
    },

    $takeErr(data: {}): void {
      unit.takeErr()
    },

    $setPinData({
      type,
      pinId,
      data,
    }: {
      type: IO
      pinId: string
      data: string | DataRef
    }) {
      const { classes, specs } = unit.__system

      const dataRef = evaluateDataValue(data, specs, classes)

      const _data = resolveDataRef(dataRef, specs, classes)

      unit.setPinData(type, pinId, _data)
    },

    $removePinData(data: { type: IO; pinId: string }) {
      const { type, pinId } = data

      unit.removePinData(type, pinId)
    },

    $pullInput(data: { pinId: string }): void {
      const { pinId } = data

      const input = unit.getInput(pinId)

      input.pull()
    },
    $restore: function (data: UnitRestoreData): void {
      const { memory } = data

      evaluateMemorySpec(memory, unit.__system.specs, unit.__system.classes)

      unit.restore(memory)
    },
    $destroy: function (data: UnitDestroyData): void {
      unit.destroy()
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
    $refGlobalObj(data: GlobalRefSpec): $_ {
      const system = unit.__system

      const { globalId, __ } = data

      const $ = getGlobalRef(system, globalId)

      if (!$) {
        return null
      }

      const $obj = Async($, __, system.async)

      return $obj
    },
    $refPin(data: { type: IO; pinId: string }) {
      const { type, pinId } = data

      const system = unit.__system

      const pin = unit.getPin(type, pinId)

      const $pin = Async(pin, ['V'], system.async)

      return $pin
    },
  }
}

export const AsyncU: (unit: Unit) => $U = (unit: Unit) => {
  return {
    ...AsyncUGet(unit),
    ...AsyncUCall(unit),
    ...AsyncUWatch(unit),
    ...AsyncURef(unit),
  }
}
