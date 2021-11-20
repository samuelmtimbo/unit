import { Config } from '../Class/Unit/Config'
import { Pin } from '../Pin'
import { PinOpt } from '../PinOpt'
import { PinOpts } from '../PinOpts'
import { Pins } from '../Pins'
import { Dict } from '../types/Dict'
import { IO } from '../types/IO'
import { None } from '../types/None'
import { $_ } from './$_'

export interface U<I = any, O = any> extends $_ {
  setParent(parent: U | null)

  setInputs(inputs: Pins<I>, opts: PinOpts): void

  setPin(name: string, type: IO, pin: Pin<any>, opt: PinOpt)

  setPinIgnored(type: IO, name: string, ignored: boolean): void

  setInputIgnored(name: string, ignore?: boolean): boolean

  setOutputIgnored(name: string, ignore?: boolean): boolean

  setPinRef(type: IO, name: string, ref: boolean): void

  setInputRef(name: string, ref: boolean): void

  setOutputRef(name: string, ref: boolean): void

  setInput(name: string, input: Pin<I[keyof I]>, opt: PinOpt): void

  isPinIgnored(type: IO, name: string): boolean

  swapPin(type: IO, name: string, pin: Pin): void

  addInput(name: string, input: Pin<any>, opt: PinOpt): void

  removeInput(name: string): void

  setOutputs(outputs: Pins<O>, opts: PinOpts)

  setOutput(name: string, output: Pin<any>, opt: PinOpt)

  addOutput(name: string, output: Pin<any>): void

  removeOutput(name: string): void

  removePin(type: IO, name: string)

  getPin(type: IO, pinId: string): Pin<any>

  getInputs(): Pins<Partial<I>>

  getDataInputs(): Pins<Partial<I>>

  getRefInputs(): Pins<Partial<I>>

  getInput(name: string): Pin<any>

  getOutputs(): Pins<Partial<O>>

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

  hasRefPinNamed(type: IO, name: string): boolean

  hasRefInputNamed(name: string): boolean

  hasRefOutputNamed(name: string): boolean

  hasPinNamed(type: IO, name: string): boolean

  hasInputNamed(name: string): boolean

  renameOutput(name: string, newName: string): void

  hasOutputNamed(name: string): boolean

  getInputCount(): number

  getOutputCount(): number

  getInputNames(): string[]

  getOutputNames(): string[]

  setPinData(type: IO, pinId: string, data: any): void

  removePinData(type: IO, pinId: string): void

  setInputConstant(pinId: string, constant: boolean): void

  setOutputConstant(pinId: string, constant: boolean): void

  getCatchErr(): boolean

  getConfig(): Config

  reset(): void

  pause(): void

  play(): void

  paused(): boolean

  getSelfPin(): Pin<U>

  err(err?: string | Error | None): string | null

  hasErr(): boolean

  getErr(): string | null

  takeErr(): string | null

  destroy(): void

  getPinData(): { input: Dict<any>; output: Dict<any> }

  getInputData(): Dict<any>

  getRefInputData(): Dict<U>
}
