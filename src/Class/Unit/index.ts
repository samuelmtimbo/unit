import { $, $Events } from '../$'
import { SELF } from '../../constant/SELF'
import { DuplicatedInputFoundError } from '../../exception/DuplicatedInputFoundError'
import { DuplicatedOutputFoundError } from '../../exception/DuplicatedOutputFoundError'
import { InputNotFoundError } from '../../exception/InputNotFoundError'
import { InvalidArgumentType } from '../../exception/InvalidArgumentType'
import { OutputNotFoundError } from '../../exception/OutputNotFoundError'
import { Pin, Pin_M } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { PinOpts } from '../../PinOpts'
import { Pins } from '../../Pins'
import { stringify } from '../../spec/stringify'
import { stringifyMemorySpecData } from '../../spec/stringifySpec'
import { System } from '../../system'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import { keys } from '../../system/f/object/Keys/f'
import { Spec } from '../../types'
import { Dict } from '../../types/Dict'
import { U, U_EE } from '../../types/interface/U'
import { IO } from '../../types/IO'
import { None } from '../../types/None'
import { UnitBundleSpec } from '../../types/UnitBundleSpec'
import { Unlisten } from '../../types/Unlisten'
import { pull, push, removeAt } from '../../util/array'
import { mapObjVK } from '../../util/object'
import { Memory } from './Memory'

export type PinMap<T> = Dict<Pin<T[keyof T]>>

const toPinMap = <T>(
  names: string[],
  opts: PinOpts
): {
  [K in keyof T]?: Pin<T[K]>
} => {
  return names.reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Pin(opts[name] ?? {}),
    }),
    {}
  )
}

export interface ION<I, O> {
  i?: string[]
  o?: string[]
}

export interface Opt {
  input?: PinOpts
  output?: PinOpts
}

export const DEFAULT_PIN_OPT: PinOpt = {
  ref: false,
}

export type PinOf<T> = Pin<T[keyof T]>

export type UnitEvents<_EE extends Dict<any[]>> = $Events<_EE & U_EE> & U_EE

export interface U_M {}

export class Unit<
    I extends Dict<any> = any,
    O extends Dict<any> = any,
    _EE extends UnitEvents<_EE> & Dict<any[]> = UnitEvents<U_EE>
  >
  extends $<_EE>
  implements U<I, O>
{
  public __: string[] = ['U']
  public id: string

  public _parent: Unit | null = null

  public _input: Pins<I> = {}
  public _output: Pins<O> = {}

  public _data_input: Pins<any> = {}
  public _data_output: Pins<any> = {}

  public _ref_input: Pins<any> = {}
  public _ref_output: Pins<any> = {}

  protected _i_opt: Dict<PinOpt> = {}
  protected _o_opt: Dict<PinOpt> = {}

  protected _i_name_set: Set<string> = new Set()
  protected _o_name_set: Set<string> = new Set()

  protected _d_i_name: Set<string> = new Set()
  protected _d_o_name: Set<string> = new Set()

  protected _r_i_name: Set<string> = new Set()
  protected _r_o_name: Set<string> = new Set()

  protected _o_count: number = 0
  protected _i_count: number = 0

  protected _d_i_count: number = 0
  protected _d_o_count: number = 0

  protected _r_i_count: number = 0
  protected _r_o_count: number = 0

  protected _err: string | null = null

  protected _selfInput: Pin
  protected _selfOutput: Pin<U>

  public ref: any | null = null

  public _paused: boolean = true

  public _opt: Opt

  constructor(
    { i = [], o = [] }: ION<I, O>,
    opt: Opt = {},
    system: System,
    id: string
  ) {
    super(system)

    const { input, output } = opt

    const inputMap = toPinMap<I>(i, opt.input ?? {})
    const outputMap = toPinMap<O>(o, opt.output ?? {})

    this.setInputs(inputMap, input)
    this.setOutputs(outputMap, output)

    this._selfInput = new Pin<U>({ data: this, constant: false, ref: true })
    this._selfOutput = new Pin<U>({ data: this, constant: false, ref: true })

    this._selfOutput.addListener('drop', () => {
      throw new Error('self output cannot be dropped')
    })

    this.id = id

    system.registerUnit(id)
  }

  public isElement() {
    return false
  }

  public isPinIgnored(type: IO, pinId: string): boolean {
    const pin = this.getPin(type, pinId)
    const ignored = pin.ignored()
    return ignored
  }

  public isPinConstant(type: IO, pinId: string): boolean {
    const pin = this.getPin(type, pinId)
    const constant = pin.constant()
    return constant
  }

  public isPinRef(type: IO, pinId: string): boolean {
    const input = type === 'input'

    if (!input && pinId === SELF) {
      return true
    }

    const ref =
      (input && !!this._ref_input[pinId]) ||
      (!input && !!this._ref_output[pinId])

    return ref
  }

  public setParent(parent: Unit | null) {
    this._parent = parent

    this.emit('parent', this._parent)
  }

  public setPinIgnored(type: IO, pinId: string, ignored: boolean): void {
    if (type === 'input') {
      this.setInputIgnored(pinId, ignored)
    } else {
      this.setOutputIgnored(pinId, ignored)
    }
  }

  public setPinConstant(type: IO, pinId: string, constant: boolean): void {
    this.getPin(type, pinId).constant(constant)

    this.emit('set_pin_constant', type, pinId, constant)
  }

  private _memSetPinOptData(type: IO, pinId: string): void {
    if (type === 'input') {
      this._memSetInputData(pinId)
    } else {
      this._memSetOutputData(pinId)
    }
  }

  private _memSetInputData(pinId: string): void {
    const input = this._input[pinId]

    this._memRemoveRefInput(pinId)
    this._memAddDataInput(pinId, input)
  }

  private _memSetOutputData(pinId: string): void {
    const output = this._output[pinId]

    this._memRemoveRefOutput(pinId)
    this._memAddDataOutput(pinId, output)
  }

  private _memSetPinRef(type: IO, pinId: string): void {
    if (type === 'input') {
      this._memSetInputRef(pinId)
    } else {
      this._memSetOutputRef(pinId)
    }
  }

  private _memSetInputRef(pinId: string): void {
    const input = this._input[pinId]

    this._memRemoveDataInput(pinId)
    this._memAddRefInput(pinId, input)
  }

  private _memSetOutputRef(pinId: string): void {
    const output = this._output[pinId]

    this._memRemoveDataOutput(pinId)
    this._memAddRefOutput(pinId, output)
  }

  public setPinRef(type: IO, pinId: string, ref: boolean): void {
    if (ref) {
      if (this.hasRefPinNamed(type, pinId)) {
        return
      } else {
        this._memSetPinRef(type, pinId)
      }
    } else {
      if (this.hasPinNamed(type, pinId)) {
        return
      } else {
        this._memSetPinOptData(type, pinId)
      }
    }
  }

  public setInputRef(pinId: string, ref: boolean): void {
    this.setPinRef('input', pinId, ref)
  }

  public setOutputRef(pinId: string, ref: boolean): void {
    this.setPinRef('output', pinId, ref)
  }

  public setInputIgnored(pinId: string, ignore: boolean): boolean {
    const input = this.getInput(pinId)

    if (this.hasRefInputNamed(pinId)) {
      return
    }

    return input.ignored(ignore)
  }

  public setOutputIgnored(pinId: string, ignore: boolean): boolean {
    const output = this.getOutput(pinId)

    return output.ignored(ignore)
  }

  public setInputs(inputs: Pins<I>, opts: PinOpts = {}): void {
    for (const name in inputs) {
      const input = inputs[name]
      const opt = opts[name]

      this.setInput(name, input, opt)
    }
  }

  public setPin(
    type: IO,
    pinId: string,
    pin: Pin<any>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate: boolean = true
  ) {
    if (type === 'input') {
      this.setInput(pinId, pin, opt, propagate)
    } else {
      this.setOutput(pinId, pin, opt, propagate)
    }
  }

  public setInput<K extends keyof I>(
    pinId: string,
    input: Pin<I[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate: boolean = true
  ) {
    this._setInput(pinId, input, opt)

    this.emit('set_input', pinId, input, opt, propagate)
  }

  public _setInput<K extends keyof I>(
    pinId: K,
    input: Pin<I[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT
  ) {
    if (this.hasInputNamed(pinId)) {
      this.removeInput(pinId, true)
    }

    this._i_count++

    this._i_name_set.add(pinId)

    this._input[pinId] = input
    this._i_opt[pinId] = opt

    const { ref } = opt

    if (ref) {
      this._memAddRefInput(pinId, input)
    } else {
      this._memAddDataInput(pinId, input)
    }
  }

  private _memAddDataInput(name: string, input: PinOf<I>): void {
    this._d_i_count++
    this._d_i_name.add(name)
    this._data_input[name] = input
  }

  private _memAddRefInput(name: string, input: PinOf<I>): void {
    this._r_i_count++
    this._r_i_name.add(name)
    this._ref_input[name] = input
  }

  private _validateInputName(name: any): void {
    if (typeof name === 'string') {
      if (!this.hasInputNamed(name)) {
        throw new InputNotFoundError(name)
      }
    } else {
      throw new InvalidArgumentType('name should be a string')
    }
  }

  private _validateOutputName(name: any): void {
    if (typeof name === 'string') {
      if (!this.hasOutputNamed(name)) {
        throw new OutputNotFoundError(name)
      }
    } else {
      throw new InvalidArgumentType('name should be a string')
    }
  }

  public addPin(type: IO, name: string, pin: Pin<any>, opt: PinOpt): void {
    if (type === 'input') {
      this.addInput(name, pin, opt)
    } else {
      this.addOutput(name, pin, opt)
    }
  }

  public addInput(
    name: string,
    input: Pin<any>,
    opt: PinOpt = DEFAULT_PIN_OPT
  ): void {
    if (this.hasInputNamed(name)) {
      throw new DuplicatedInputFoundError(name)
    }
    this.setInput(name, input, opt)
  }

  public removeInput(name: string, propagate: boolean = false): void {
    if (!this.hasInputNamed(name)) {
      throw new InputNotFoundError(name)
    }

    const input = this._input[name]

    this.emit('before_remove_input', name, input)

    this._i_count--
    this._i_name_set.delete(name)
    delete this._input[name]

    const opt = this._i_opt[name]

    const { ref } = opt

    if (ref) {
      this._memRemoveRefInput(name)
    } else {
      this._memRemoveDataInput(name)
    }

    this.emit('remove_input', name, input, propagate)
  }

  private _memRemoveDataInput = (name: string): void => {
    this._d_i_count--
    this._d_i_name.delete(name)
    delete this._data_input[name]
  }

  private _memRemoveRefInput = (name: string): void => {
    this._r_i_count--
    this._r_i_name.delete(name)
    delete this._ref_input[name]
  }

  public setOutputs(outputs: Pins<O>, opts: PinOpts = {}): void {
    for (let name in outputs) {
      const output = outputs[name]
      const opt = opts[name]
      this.setOutput(name, output, opt)
    }
  }

  public setOutput<K extends keyof O>(
    name: K,
    output: Pin<O[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate: boolean = true
  ) {
    this._setOutput(name, output, opt, propagate)

    this.emit('set_output', name, output, opt, propagate)
  }

  public _setOutput<K extends keyof O>(
    name: K,
    output: Pin<O[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT,
    propagate: boolean
  ) {
    if (this.hasOutputNamed(name)) {
      this.removeOutput(name, propagate)
    }

    if (name === SELF) {
      this._selfOutput = output
    }

    this._o_count++
    this._o_name_set.add(name)

    this._o_opt[name] = opt

    const { ref } = opt

    if (ref) {
      this._memAddRefOutput(name, output)
    } else {
      this._memAddDataOutput(name, output)
    }

    this._output[name] = output
  }

  private _memAddRefOutput = (name: string, output: Pin<O[keyof O]>): void => {
    this._r_o_count++
    this._r_o_name.add(name)

    this._memSetRefOutput(name, output)
  }

  private _memSetRefOutput = (name: string, output: Pin<O[keyof O]>): void => {
    this._ref_output[name] = output
  }

  private _memAddDataOutput = (name: string, output: Pin<O[keyof O]>): void => {
    this._d_o_count++
    this._d_o_name.add(name)

    this._memSetDataOutput(name, output)
  }

  private _memSetDataOutput = (name: string, output: Pin<O[keyof O]>): void => {
    this._data_output[name] = output
  }

  public addOutput(
    name: string,
    output: Pin<any>,
    opt: PinOpt = DEFAULT_PIN_OPT
  ): void {
    if (this.hasOutputNamed(name)) {
      throw new DuplicatedOutputFoundError(name)
    }
    this.setOutput(name, output, opt)
  }

  private _memRemoveRefPin = (type: IO, name: string): void => {
    if (type === 'input') {
      this._memRemoveRefInput(name)
    } else {
      this._memRemoveRefOutput(name)
    }
  }

  private _memRemoveRefOutput = (name: string): void => {
    this._r_o_count--
    this._r_o_name.delete(name)
    delete this._ref_output[name]
  }

  private _memRemoveDataOutput = (name: string): void => {
    this._d_o_count--
    this._d_o_name.delete(name)
    delete this._data_output[name]
  }

  public removeOutput(name: string, propagate: boolean): void {
    if (!this.hasOutputNamed(name)) {
      throw new OutputNotFoundError(name)
    }

    const output = this._output[name]

    this.emit('before_remove_output', name, output)

    this._o_count--
    this._o_name_set.delete(name)

    const opt = this._o_opt[name]

    const { ref } = opt

    if (ref) {
      this._memRemoveRefOutput(name)
    } else {
      this._memRemoveDataOutput(name)
    }

    delete this._output[name]

    this.emit('remove_output', name, output, propagate)
  }

  public removePin(type: IO, name: string, propagate: boolean): void {
    if (type === 'input') {
      this.removeInput(name, propagate)
    } else {
      this.removeOutput(name, propagate)
    }
  }

  public getPin(type: IO, pinId: string): Pin<any> {
    if (type === 'input') {
      return this.getInput(pinId)
    } else {
      return this.getOutput(pinId)
    }
  }

  public getInputs(): Pins<I> {
    return this._input
  }

  public getDataInputs(): Pins<Partial<I>> {
    return this._data_input
  }

  public getRefInputs(): Pins<Partial<I>> {
    return this._ref_input
  }

  public getInput(name: string): Pin<any> {
    if (name === SELF) {
      return this._selfInput
    }
    this._validateInputName(name)
    return this._input[name]
  }

  public getOutputs(): Pins<O> {
    return this._output
  }

  public getDataOutputs(): Pins<Partial<O>> {
    return this._data_output
  }

  public getRefOutputs(): Pins<Partial<O>> {
    return this._ref_output
  }

  public getOutput(name: string): Pin<any> {
    if (name === SELF) {
      return this._selfOutput
    }
    this._validateOutputName(name)
    return this._output[name]
  }

  public push<K extends keyof I>(name: string, data: any): void {
    this.pushInput(name, data)
  }

  public pushInput<K extends keyof I>(name: string, data: I[K]): void {
    this._validateInputName(name)
    this.getInput(name).push(data)
  }

  public pushAllInput<K extends keyof I>(data: Dict<I[K]>): void {
    forEachValueKey(data, (value, name) => this.pushInput(name, value))
  }

  public pushOutput<K extends keyof O>(name: string, data: O[K]): void {
    this.getOutput(name).push(data)
  }

  public pushAllOutput<K extends keyof O>(data: Dict<O[K]>): void {
    forEachValueKey(data, (value, name) => this.pushOutput(name, value))
  }

  public pushAll<K extends keyof I>(data: Dict<I[K]>): void {
    this.pushAllInput(data)
  }

  public pullInput<K extends keyof I>(name: string): I[K] {
    return this.getInput(name).pull()
  }

  public pullOutput<K extends keyof O>(name: string): O[K] {
    return this.getOutput(name).pull()
  }

  public pullPin<K extends keyof O>(type: IO, name: string): O[K] | I[K] {
    return type === 'input' ? this.pullInput(name) : this.pullOutput(name)
  }

  public takePin<K extends keyof O>(type: IO, name: string): O[K] | I[K] {
    return type === 'input' ? this.takeInput(name) : this.takeOutput(name)
  }

  public takeInput<K extends keyof O>(name: string): O[K] {
    this._validateInputName(name)
    return this.getInput(name).take()
  }

  public takeOutput<K extends keyof O>(name: string): O[K] {
    return this.getOutput(name).take()
  }

  // short for takeOutput
  public take<K extends keyof O>(name: string): O[K] {
    return this.takeOutput(name)
  }

  public takeAll(): Dict<any> {
    return mapObjVK(this._output, (output) => output.take())
  }

  public peakInput<K extends keyof I>(name: string): I[K] {
    return this.getInput(name).peak()
  }

  public peakOutput<K extends keyof O>(name: string): O[K] {
    return this.getOutput(name).peak()
  }

  public peak<K extends keyof O>(name: string): O[K] {
    return this.peakOutput(name)
  }

  public peakAllOutput(): Dict<any> {
    return mapObjVK(this._output, (pin) => pin.peak())
  }

  public peakAll(): Dict<any> {
    return this.peakAllOutput()
  }

  public hasPinNamed(type: IO, name: string): boolean {
    if (type === 'input') {
      return this.hasInputNamed(name)
    } else {
      return this.hasOutputNamed(name)
    }
  }

  public hasInputNamed(name: string): boolean {
    return this._input[name] !== undefined
  }

  public hasOutputNamed(name: string): boolean {
    return this._output[name] !== undefined
  }

  public hasDataPinNamed(type: IO, name: string): boolean {
    if (type === 'input') {
      return this.hasDataInputNamed(name)
    } else {
      return this.hasDataOutputNamed(name)
    }
  }

  public hasDataInputNamed(name: string): boolean {
    return this._d_i_name.has(name)
  }

  public hasDataOutputNamed(name: string): boolean {
    return this._d_o_name.has(name)
  }

  public hasRefPinNamed(type: IO, name: string): boolean {
    if (type === 'input') {
      return this.hasRefInputNamed(name)
    } else {
      return this.hasRefOutputNamed(name)
    }
  }

  public hasRefInputNamed(name: string): boolean {
    return this._r_i_name.has(name)
  }

  public renamePin(type: IO, name: string, newName: string): void {
    if (type === 'input') {
      this.renameInput(name, newName)
    } else {
      this.renameOutput(name, newName)
    }
  }

  public renameInput(
    name: keyof I,
    newName: keyof I,
    propagate: boolean = true
  ): void {
    // console.log('renameInput', name, newName, propagate)

    if (!this.hasInputNamed(name)) {
      throw new InputNotFoundError(name)
    }

    const input = this._input[name]
    const opt = this._i_opt[name]

    this._i_name_set.delete(name)
    this._i_name_set.add(newName)

    delete this._input[name]
    delete this._i_opt[name]

    this._input[newName] = input
    this._i_opt[newName] = opt

    const { ref } = opt

    if (ref) {
      this._r_i_name.delete(name)
      this._r_i_name.add(newName)

      delete this._ref_input[name]

      this._ref_input[newName] = input
    } else {
      this._d_i_name.delete(name)
      this._d_i_name.add(newName)

      delete this._data_input[name]

      this._data_input[newName] = input
    }

    this.emit('rename_input', name, newName)
  }

  public renameOutput(
    name: keyof O,
    newName: keyof O,
    propagate: boolean = true
  ): void {
    if (!this.hasOutputNamed(name)) {
      throw new InputNotFoundError(name)
    }

    const output = this._output[name]
    const opt = this._o_opt[name]

    this._o_name_set.delete(name)
    this._o_name_set.add(newName)

    delete this._output[name]
    this._output[newName] = output

    delete this._o_opt[name]
    this._o_opt[newName] = opt

    const { ref } = opt

    if (ref) {
      this._r_o_name.delete(name)
      this._r_o_name.add(newName)

      delete this._ref_output[name]
      this._ref_output[newName] = output
    } else {
      this._d_o_name.delete(name)
      this._d_o_name.add(newName)

      delete this._data_output[name]
      this._data_output[newName] = output
    }

    this.emit('rename_output', name, newName)
  }

  public getInputOpt(name: string): PinOpt {
    return this._i_opt[name]
  }

  public getOutputOpt(name: string): PinOpt {
    return this._o_opt[name]
  }

  public hasRefOutputNamed(name: string): boolean {
    return this._r_o_name.has(name)
  }

  public getInputCount(): number {
    return this._i_count
  }

  public getOutputCount(): number {
    return this._o_count
  }

  public getInputNames(): string[] {
    return keys(this._input)
  }

  public getOutputNames(): string[] {
    return keys(this._output)
  }

  public setPinData(type: IO, pinId: string, data: any): void {
    const pin = this.getPin(type, pinId)
    pin.push(data)
  }

  public removePinData(type: IO, pinId: string): void {
    const pin = this.getPin(type, pinId)

    pin.take()
  }

  public setInputConstant(pinId: string, constant: boolean): void {
    const input = this.getInput(pinId)
    input.constant(constant)
  }

  public setOutputConstant(pinId: string, constant: boolean): void {
    const output = this.getOutput(pinId)
    output.constant(constant)
  }

  public getCatchErr(): boolean {
    return this._catchErr
  }

  private _catcherCallback: ((err: string | null) => void)[] = []
  private _catcherDoneCount: number = 0
  private _catcherDone: boolean[] = []

  protected _catchErr: boolean = false
  protected _caughtErr: string | null = null

  public caughtErr(): string | null {
    return this._caughtErr
  }

  public catch(callback: (err: string) => void): {
    unlisten: Unlisten
    done: () => void
  } {
    push(this._catcherCallback, callback)
    push(this._catcherDone, false)

    this._catchErr = true

    const err = this._err

    if (err) {
      this._err = null
      this._caughtErr = err
      this.emit('catch_err', err)
    }

    const _check_all_done = () => {
      if (this._catcherDoneCount === this._catcherCallback.length) {
        _all_done()
      }
    }

    const _all_done = () => {
      const caughtErr = this._caughtErr

      this._caughtErr = null
      this._catcherDoneCount = 0
      this._catcherDone.fill(false)

      this.emit('take_caught_err', caughtErr)
    }

    const unlisten = () => {
      const i = this._catcherCallback.indexOf(callback)

      if (i > -1) {
        pull(this._catcherCallback, callback)

        const done = this._catcherDone[i]

        removeAt(this._catcherDone, i)

        if (this._catcherCallback.length === 0) {
          const err = this._caughtErr
          this._catchErr = false
          if (err !== null) {
            this._caughtErr = null
            this.err(err)
            this.emit('take_caught_err', err)
          }
        }

        if (!done) {
          _check_all_done()
        }
      } else {
        throw new Error('unregistered Catcher cannot call unlisten')
      }
    }

    const done = () => {
      if (this._caughtErr) {
        const i = this._catcherCallback.indexOf(callback)
        if (i > -1) {
          const done = this._catcherDone[i]
          if (done) {
            throw new Error('catcher cannot be done twice')
          } else {
            this._catcherDone[i] = true
            this._catcherDoneCount++
            _check_all_done()
          }
        } else {
          throw new Error('unregistered Catcher cannot call done')
        }
      } else {
        throw new Error("catcher cannot call done when there's no caught error")
      }
    }

    return { unlisten, done }
  }

  public getConfig(): Opt {
    return this._opt
  }

  public reset(): void {
    this.takeErr()

    this.emit('reset')
  }

  public pause(): void {
    if (!this._paused) {
      this._paused = true
      this.emit('pause')
    }
  }

  public play(): void {
    if (this._paused) {
      this._paused = false
      this.emit('play')
    }
  }

  public paused(): boolean {
    return this._paused
  }

  public getSelfPin(): Pin<U> {
    return this._selfOutput
  }

  public err(err?: string | Error | None): string | null {
    // console.log('Unit', 'err', err)
    // everything is alright when there is no err
    if (err) {
      if (err instanceof Error) {
        err = err.message
      }
      if (this._catchErr) {
        this._caughtErr = err
        for (const callback of this._catcherCallback) {
          callback(err)
        }
      } else {
        // exceptions in unit are isolated to the unit
        // they do not kill the application
        // they are expected though to stop the unit from functioning
        this._err = err
        this.emit('err', err)
      }
    }
    return this._err
  }

  public hasErr(): boolean {
    return this._err !== null
  }

  public getErr(): string | null {
    return this._err
  }

  public takeErr(): string | null {
    const err = this._err
    if (err) {
      this._err = null
      this.emit('take_err', err)
    }
    return err
  }

  public takeCaughtErr(): string | null {
    const err = this._caughtErr
    if (err) {
      this._caughtErr = null

      for (const callback of this._catcherCallback) {
        callback(null)
      }

      this.emit('take_caught_err', err)
    }
    return err
  }

  public destroy(): void {
    this.__system.unregisterUnit(this.id)

    super.destroy()
  }

  public getPinData(type: IO, pinId: string): any {
    const pin = this.getPin(type, pinId)

    const data = pin.peak()

    return data
  }

  public getPinsData(): { input: Dict<any>; output: Dict<any> } {
    const data: { input: Dict<any>; output: Dict<any> } = {
      input: {},
      output: {},
    }
    forEachValueKey(this._input, (input, inputId) => {
      data.input[inputId] = input.peak()
    })
    forEachValueKey(this._output, (output, outputId) => {
      data.output[outputId] = output.peak()
    })
    return data
  }

  public getInputData(): Partial<I> {
    const data: Partial<I> = {}
    forEachValueKey(this._input, (input, inputId) => {
      if (!input.empty()) {
        const datum = input.peak()
        data[inputId] = datum
      }
    })
    return data
  }

  public getRefInputData(): Dict<Unit> {
    const data: Dict<any> = {}

    forEachValueKey(this._ref_input, (input, inputId) => {
      if (!input.empty()) {
        let datum = input.peak()

        data[inputId] = datum
      }
    })

    return data
  }

  public getSpec(): Spec {
    return this.__system.getSpec(this.id)
  }

  public getUnitBundleSpec(deep: boolean = false): UnitBundleSpec {
    let memory = undefined

    if (deep) {
      memory = this.snapshot()

      stringifyMemorySpecData(memory)
    }

    const input = mapObjVK(this._input, (input) => {
      const ignored = input.ignored()
      const constant = input.constant()
      const _data = input.peak()
      const data =
        constant && _data !== undefined ? stringify(_data) : undefined

      return {
        ignored,
        constant,
        data,
      }
    })

    const output = mapObjVK(this._output, (output) => {
      const ignored = output.ignored()
      const constant = output.constant()
      const data = undefined // TODO

      return {
        ignored,
        constant,
        data,
      }
    })

    return { unit: { id: this.id, memory, input, output }, specs: {} }
  }

  public snapshotSelf(): Dict<any> {
    return undefined
  }

  public snapshotInput<T extends keyof I>(pinId: T): Pin_M<I[T]> {
    return this.getInput(pinId).snapshot()
  }

  public snapshotInputs(): Dict<Pin_M> {
    const state = {}

    for (const name of this._d_i_name) {
      state[name] = this.snapshotInput(name)
    }

    return state
  }

  public snapshotOutput<T extends keyof O>(pinId: T): Pin_M<O[T]> {
    return this.getOutput(pinId).snapshot()
  }

  public snapshotOutputs(): Dict<Pin_M> {
    const state = {}

    // for (const name of this._o_name_set) {
    //   state[name] = this.snapshotOutput(name)
    // }

    for (const name of this._d_o_name) {
      state[name] = this.snapshotOutput(name)
    }

    return state
  }

  public snapshot(): Memory {
    return {
      input: this.snapshotInputs(),
      output: this.snapshotOutputs(),
      memory: this.snapshotSelf(),
    }
  }

  public restoreSelf(state: Dict<any>): void {
    return
  }

  public restoreInputs(state: Dict<Pin_M>): void {
    for (const name in state) {
      const memory = state[name]

      this.restoreInput(name, memory)
    }
  }

  public restoreInput(pinId: string, state: Pin_M): void {
    this.getInput(pinId).restore(state)
  }

  public restoreOutputs(state: Dict<Pin_M>): void {
    for (const name in state) {
      const memory = state[name]

      this.restoreOutput(name, memory)
    }
  }

  public restoreOutput(pinId: string, state: Pin_M): void {
    this.getOutput(pinId).restore(state)
  }

  public restore(state: {
    input?: Dict<any>
    output?: Dict<any>
    memory?: Dict<any>
  }): void {
    const { input, output, memory } = state

    this.restoreInputs(input)
    this.restoreOutputs(output)
    this.restoreSelf(memory ?? {})
  }
}
