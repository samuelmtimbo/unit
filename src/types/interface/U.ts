import { Spec } from '..'
import { Opt, Unit } from '../../Class/Unit'
import { Memory } from '../../Class/Unit/Memory'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { PinOpts } from '../../PinOpts'
import { Pins } from '../../Pins'
import { Dict } from '../Dict'
import { IO } from '../IO'
import { None } from '../None'
import { UnitBundleSpec } from '../UnitBundleSpec'

export type U_EE<I extends Dict<any> = any, O extends Dict<any> = any> = {
  parent: [Unit | null]
  set_input: [keyof I, Pin, PinOpt, boolean]
  set_output: [keyof O, Pin, PinOpt, boolean]
  before_remove_input: [keyof I, Pin]
  before_remove_output: [keyof O, Pin]
  remove_input: [keyof I, Pin, boolean]
  remove_output: [keyof O, Pin, boolean]
  rename_input: [keyof I, keyof I]
  rename_output: [keyof O, keyof O]
  set_pin_data: [IO, keyof I | keyof O, boolean]
  set_pin_constant: [IO, keyof I | keyof O, boolean]
  set_pin_ignored: [IO, keyof I | keyof O, string, boolean]
  catch_err: [string]
  err: [string]
  take_err: [string]
  take_caught_err: [string]
  reset: []
  play: []
  pause: []
  destroy: [string[]]
}

export interface U<
  I extends Dict<any> = Dict<any>,
  O extends Dict<any> = Dict<any>,
> {
  setParent(parent: Unit<any, any> | null)
  setInputs(inputs: Pins<I>, opts: PinOpts): void
  setPin<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    name: K,
    pin: Pin<any>,
    opt: PinOpt
  )
  setPinIgnored<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    name: K,
    ignored: boolean
  ): void
  setInputIgnored<K extends keyof I>(name: K, ignore?: boolean): boolean
  setOutputIgnored<K extends keyof O>(name: K, ignore?: boolean): boolean
  setPinRef<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    name: K,
    ref: boolean
  ): void
  setInputRef<K extends keyof I>(name: K, ref: boolean): void
  setOutputRef<K extends keyof O>(name: K, ref: boolean): void
  setInput<K extends keyof I>(name: K, input: Pin<I[K]>, opt: PinOpt): void
  isPinConstant<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    name: K
  ): boolean
  isPinIgnored<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    name: K
  ): boolean
  isPinRef<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    name: K
  ): boolean
  addInput(name: string, input: Pin<any>, opt: PinOpt): void
  removeInput(name: string, propagate: boolean): void
  setOutputs(outputs: Pins<O>, opts: PinOpts)
  setOutput(name: string, output: Pin<any>, opt: PinOpt)
  addOutput(name: string, output: Pin<any>): void
  removeOutput(name: string, propagate: boolean): void
  removePin(type: IO, name: string, propagate: boolean)
  getPin(type: IO, name: string): Pin<any>
  getInputs(): Pins<I>
  getDataInputs(): Pins<Partial<I>>
  getRefInputs(): Pins<Partial<I>>
  getInput<K extends keyof I>(name: K): Pin<K>
  getOutputs(): Pins<O>
  getDataOutputs(): Pins<Partial<O>>
  getRefOutputs(): Pins<Partial<O>>
  getOutput<K extends keyof O>(name: K): Pin<O[K]>
  push<K extends keyof I>(name: K, data: any): void
  pushInput<K extends keyof I>(name: K, data: I[K]): void
  pushAllInput(data: Partial<I>): void
  pushOutput<K extends keyof O>(name: K, data: O[K]): void
  pushAllOutput(data: Partial<O>): void
  pushAll(data: Partial<I>): void
  takeInput<K extends keyof I>(name: K): I[K]
  takeOutput<K extends keyof O>(name: K): O[K]
  take<K extends keyof O>(name: K): O[K]
  takeAll(): Dict<any>
  peakInput<K extends keyof I>(name: K): I[K]
  peakOutput<K extends keyof O>(name: K): O[K]
  peak<K extends keyof O>(name: K): O[K]
  peakAllOutput(): Dict<any>
  peakAll(): Dict<any>
  renamePin<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    name: K,
    newName: K
  ): void
  renameInput<K extends keyof I>(name: K, newName: K): void
  renameOutput(name: string, newName: string): void
  hasRefPinNamed<T extends IO, K extends T extends 'input' ? keyof I : keyof O>(
    type: T,
    name: K
  ): boolean
  hasRefInputNamed<K extends keyof I>(name: K): boolean
  hasRefOutputNamed<K extends keyof O>(name: K): boolean
  hasPinNamed(type: IO, name: string): boolean
  hasInputNamed<K extends keyof I>(name: K): boolean
  hasOutputNamed<K extends keyof O>(name: K): boolean
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
  snapshot(): Memory
  restore(state: Memory): void
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
