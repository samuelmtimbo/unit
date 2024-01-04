import { Spec } from '..'
import { Opt, Unit } from '../../Class/Unit'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { PinOpts } from '../../PinOpts'
import { Pins } from '../../Pins'
import { Dict } from '../Dict'
import { IO } from '../IO'
import { None } from '../None'
import { UnitBundleSpec } from '../UnitBundleSpec'

export type U_EE = {
  parent: [Unit | null]
  set_input: [string, Pin, PinOpt, boolean]
  set_output: [string, Pin, PinOpt, boolean]
  before_remove_input: [string, Pin]
  before_remove_output: [string, Pin]
  remove_input: [string, Pin]
  remove_output: [string, Pin]
  rename_input: [string, string]
  rename_output: [string, string]
  set_pin_constant: [IO, string, boolean]
  set_pin_ignored: [IO, string, boolean]
  catch_err: [string]
  err: [string]
  take_err: [string]
  take_caught_err: [string]
  reset: []
  play: []
  pause: []
}

export interface U<I = any, O = any> {
  setParent(parent: Unit<any, any> | null)
  setInputs(inputs: Pins<I>, opts: PinOpts): void
  setPin(type: IO, name: string, pin: Pin<any>, opt: PinOpt)
  setPinIgnored(type: IO, name: string, ignored: boolean): void
  setInputIgnored(name: string, ignore?: boolean): boolean
  setOutputIgnored(name: string, ignore?: boolean): boolean
  setPinRef(type: IO, name: string, ref: boolean): void
  setInputRef(name: string, ref: boolean): void
  setOutputRef(name: string, ref: boolean): void
  setInput(name: string, input: Pin<I[keyof I]>, opt: PinOpt): void
  isPinConstant(type: IO, name: string): boolean
  isPinIgnored(type: IO, name: string): boolean
  isPinRef(type: IO, name: string): boolean
  addInput(name: string, input: Pin<any>, opt: PinOpt): void
  removeInput(name: string): void
  setOutputs(outputs: Pins<O>, opts: PinOpts)
  setOutput(name: string, output: Pin<any>, opt: PinOpt)
  addOutput(name: string, output: Pin<any>): void
  removeOutput(name: string): void
  removePin(type: IO, name: string)
  getPin(type: IO, name: string): Pin<any>
  getInputs(): Pins<I>
  getDataInputs(): Pins<Partial<I>>
  getRefInputs(): Pins<Partial<I>>
  getInput<K extends keyof I>(name: K): Pin<K>
  getOutputs(): Pins<O>
  getDataOutputs(): Pins<Partial<O>>
  getRefOutputs(): Pins<Partial<O>>
  getOutput(name: string): Pin<any>
  push<K extends keyof I>(name: string, data: any): void
  pushInput<K extends keyof I>(name: string, data: I[K]): void
  pushAllInput<K extends keyof I>(data: Dict<I[K]>): void
  pushOutput<K extends keyof O>(name: string, data: O[K]): void
  pushAllOutput<K extends keyof O>(data: Dict<O[K]>): void
  pushAll<K extends keyof I>(data: Dict<I[K]>): void
  takeInput<K extends keyof O>(name: string): O[K]
  takeOutput<K extends keyof O>(name: string): O[K]
  take<K extends keyof O>(name: string): O[K]
  takeAll(): Dict<any>
  peakInput<K extends keyof I>(name: string): I[K]
  peakOutput<K extends keyof O>(name: string): O[K]
  peak<K extends keyof O>(name: string): O[K]
  peakAllOutput(): Dict<any>
  peakAll(): Dict<any>
  renamePin(type: IO, name: string, newName: string): void
  renameInput(name: string, newName: string): void
  renameOutput(name: string, newName: string): void
  hasRefPinNamed(type: IO, name: string): boolean
  hasRefInputNamed(name: string): boolean
  hasRefOutputNamed(name: string): boolean
  hasPinNamed(type: IO, name: string): boolean
  hasInputNamed(name: string): boolean
  hasOutputNamed(name: string): boolean
  getInputCount(): number
  getOutputCount(): number
  getInputNames(): string[]
  getOutputNames(): string[]
  setPinData(type: IO, name: string, data: any): void
  removePinData(type: IO, name: string): void
  setInputConstant(name: string, constant: boolean): void
  setOutputConstant(name: string, constant: boolean): void
  getCatchErr(): boolean
  getConfig(): Opt
  reset(): void
  pause(): void
  play(): void
  paused(): boolean
  snapshot(): {
    input: Dict<any>
    output: Dict<any>
    memory: Dict<any>
  }
  restore(state: {
    input: Dict<any>
    output: Dict<any>
    memory: Dict<any>
  }): void
  getSelfPin(): Pin<U>
  err(err?: string | Error | None): string | null
  hasErr(): boolean
  getErr(): string | null
  takeErr(): string | null
  getPinsData(): { input: Dict<any>; output: Dict<any> }
  getInputData(): Dict<any>
  getRefInputData(): Dict<Unit<any, any>>
  getSpec(): Spec
  getPinData(type: IO, name: string): any
  setPinConstant(type: IO, name: string, constant: boolean): void
  getUnitBundleSpec(deep?: boolean): UnitBundleSpec
}
