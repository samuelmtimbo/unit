import { $, $Events } from '../$'
import { SELF } from '../../constant/SELF'
import { DuplicatedInputFoundError } from '../../exception/DuplicatedInputFoundError'
import { DuplicatedOutputFoundError } from '../../exception/DuplicatedOutputFoundError'
import { InputNotFoundError } from '../../exception/InputNotFoundError'
import { InvalidArgumentType } from '../../exception/InvalidArgumentType'
import { OutputNotFoundError } from '../../exception/OutputNotFoundError'
import { U, U_EE } from '../../interface/U'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { PinOpts } from '../../PinOpts'
import { Pins } from '../../Pins'
import { Pod } from '../../pod'
import { System } from '../../system'
import forEachKeyValue from '../../system/core/object/ForEachKeyValue/f'
import { Dict } from '../../types/Dict'
import { IO } from '../../types/IO'
import { None } from '../../types/None'
import { Unlisten } from '../../types/Unlisten'
import { pull, push, removeAt } from '../../util/array'
import { mapObjVK } from '../../util/object'

export type PinMap<T> = Dict<Pin<T[keyof T]>>

const toPinMap = <T>(
  names: string[]
): {
  [K in keyof T]?: Pin<T[K]>
} => {
  return names.reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Pin(),
    }),
    {}
  )
}

export interface ION {
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

export class Unit<
    I extends Dict<any> = any,
    O extends Dict<any> = any,
    _EE extends UnitEvents<_EE> & Dict<any[]> = UnitEvents<U_EE>
  >
  extends $<_EE>
  implements U<I, O>
{
  public __: string[] = ['U']

  public $parent: Unit | null = null
  public $path: string[] = []
  public $id: string | null = null

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

  protected _selfPin: Pin<U>

  public ref: any | null = null

  public _paused: boolean = true

  public _opt: Opt

  constructor(
    { i = [], o = [] }: ION,
    opt: Opt = {},
    system: System,
    pod: Pod
  ) {
    super(system, pod)

    const { input, output } = opt

    const inputMap = toPinMap<I>(i)
    const outputMap = toPinMap<O>(o)

    this.setInputs(inputMap, input)
    this.setOutputs(outputMap, output)

    this._selfPin = new Pin<U>({ data: this, constant: false })
    this._selfPin.addListener('drop', () => {
      throw new Error('Self Pin should never be dropped!')
    })
  }

  public isPinIgnored(type: IO, name: string): boolean {
    const pin = this.getPin(type, name)
    const ignored = pin.ignored()
    return ignored
  }

  public setParent(parent: Unit | null) {
    this.$parent = parent
    this.emit('parent', this.$parent)
  }

  public setPinIgnored(type: IO, name: string, ignored: boolean): void {
    if (type === 'input') {
      this.setInputIgnored(name, ignored)
    } else {
      this.setOutputIgnored(name, ignored)
    }
  }

  private _memSetPinOptData(type: IO, name: string): void {
    if (type === 'input') {
      this._memSetInputData(name)
    } else {
      this._memSetOutputData(name)
    }
  }

  private _memSetInputData(name: string): void {
    const input = this._input[name]

    this._memRemoveRefInput(name)
    this._memAddDataInput(name, input)
  }

  private _memSetOutputData(name: string): void {
    const output = this._output[name]

    this._memRemoveRefOutput(name)
    this._memAddDataOutput(name, output)
  }

  private _memSetPinRef(type: IO, name: string): void {
    if (type === 'input') {
      this._memSetInputRef(name)
    } else {
      this._memSetOutputRef(name)
    }
  }

  private _memSetInputRef(name: string): void {
    const input = this._input[name]

    this._memRemoveDataInput(name)
    this._memAddRefInput(name, input)
  }

  private _memSetOutputRef(name: string): void {
    const output = this._output[name]

    this._memRemoveDataOutput(name)
    this._memAddRefOutput(name, output)
  }

  public setPinRef(type: IO, name: string, ref: boolean): void {
    if (ref) {
      if (this.hasRefPinNamed(type, name)) {
        return
      } else {
        this._memSetPinRef(type, name)
      }
    } else {
      if (this.hasPinNamed(type, name)) {
        return
      } else {
        this._memSetPinOptData(type, name)
      }
    }
  }

  public setInputRef(name: string, ref: boolean): void {
    this.setPinRef('input', name, ref)
  }

  public setOutputRef(name: string, ref: boolean): void {
    this.setPinRef('output', name, ref)
  }

  public setInputIgnored(name: string, ignore: boolean): boolean {
    const input = this.getInput(name)
    if (this.hasRefInputNamed(name)) {
      return
    }
    return input.ignored(ignore)
  }

  public setOutputIgnored(name: string, ignore: boolean): boolean {
    if (this.hasRefOutputNamed(name)) {
      return
    }
    const output = this.getOutput(name)
    return output.ignored(ignore)
  }

  public setInputs(inputs: Pins<I>, opts: PinOpts = {}): void {
    for (let name in inputs) {
      const input = inputs[name]
      const opt = opts[name]
      this.setInput(name, input, opt)
    }
  }

  public setPin(
    name: string,
    type: IO,
    pin: Pin<any>,
    opt: PinOpt = DEFAULT_PIN_OPT
  ) {
    if (type === 'input') {
      this.setInput(name, pin, opt)
    } else {
      this.setOutput(name, pin, opt)
    }
  }

  public setInput<K extends keyof I>(
    name: string,
    input: Pin<I[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT
  ) {
    this._setInput(name, input, opt)

    this.emit('set_input', name, input, opt)
  }

  public _setInput<K extends keyof I>(
    name: K,
    input: Pin<I[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT
  ) {
    if (this.hasInputNamed(name)) {
      this.removeInput(name)
    }

    this._i_count++
    this._i_name_set.add(name)
    this._input[name] = input

    this._i_opt[name] = opt

    const { ref } = opt

    if (ref) {
      this._memAddRefInput(name, input)
    } else {
      this._memAddDataInput(name, input)
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
      console.trace('name', name)
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

  public removeInput(name: string): void {
    if (!this.hasInputNamed(name)) {
      throw new InputNotFoundError(name)
    }

    const input = this._input[name]

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

    this.emit('remove_input', name, input)
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
    opt: PinOpt = DEFAULT_PIN_OPT
  ) {
    this._setOutput(name, output, opt)

    this.emit('set_output', name, output, opt)
  }

  public _setOutput<K extends keyof O>(
    name: K,
    output: Pin<O[K]>,
    opt: PinOpt = DEFAULT_PIN_OPT
  ) {
    if (this.hasOutputNamed(name)) {
      this.removeOutput(name)
    }

    if (name === SELF) {
      this._selfPin = output
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

  public removeOutput(name: string): void {
    if (!this.hasOutputNamed(name)) {
      throw new OutputNotFoundError(name)
    }

    this._o_count--
    this._o_name_set.delete(name)

    const opt = this._o_opt[name]

    const { ref } = opt

    if (ref) {
      this._memRemoveRefOutput(name)
    } else {
      this._memRemoveDataOutput(name)
    }

    const output = this._output[name]

    delete this._output[name]

    this.emit('remove_output', name, output)
  }

  public removePin(type: IO, name: string): void {
    if (type === 'input') {
      this.removeInput(name)
    } else {
      this.removeOutput(name)
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
      return this._selfPin
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
    forEachKeyValue(data, (value, name) => this.pushInput(name, value))
  }

  public pushOutput<K extends keyof O>(name: string, data: O[K]): void {
    this.getOutput(name).push(data)
  }

  public pushAllOutput<K extends keyof O>(data: Dict<O[K]>): void {
    forEachKeyValue(data, (value, name) => this.pushOutput(name, value))
  }

  public pushAll<K extends keyof I>(data: Dict<I[K]>): void {
    this.pushAllInput(data)
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

  public renameInput(name: keyof I, newName: keyof I): void {
    if (!this.hasInputNamed(name)) {
      throw new InputNotFoundError(name)
    }

    const input = this._input[name]
    const opt = this._i_opt[name]

    this._i_name_set.delete(name)
    this._i_name_set.add(newName)

    delete this._input[name]
    this._input[newName] = input

    delete this._i_opt[name]
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

  public renameOutput(name: keyof O, newName: keyof O): void {
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
    return Object.keys(this._input)
  }

  public getOutputNames(): string[] {
    return Object.keys(this._output)
  }

  public setPinData(type: IO, pinId: string, data: any): void {
    const pin = this.getPin(type, pinId)
    // AD HOC
    try {
      pin.push(data)
    } catch (err) {
      this.err(err.message.toLowerCase())
    }
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
        throw new Error('Unregistered Catcher cannot call unlisten')
      }
    }

    const done = () => {
      if (this._caughtErr) {
        const i = this._catcherCallback.indexOf(callback)
        if (i > -1) {
          const done = this._catcherDone[i]
          if (done) {
            throw new Error('Catcher cannot be done twice')
          } else {
            this._catcherDone[i] = true
            this._catcherDoneCount++
            _check_all_done()
          }
        } else {
          throw new Error('Unregistered Catcher cannot call done')
        }
      } else {
        throw new Error("Catcher cannot call done when there's no Caught Error")
      }
    }

    return { unlisten, done }
  }

  public getConfig(): Opt {
    return this._opt
  }

  // just a little more helpful log
  protected _log(...args: any[]) {
    console.log(`[${this.constructor.name}]`, ...args)
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
    return this._selfPin
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
    super.destroy()
  }

  public getPinData(): { input: Dict<any>; output: Dict<any> } {
    const data: { input: Dict<any>; output: Dict<any> } = {
      input: {},
      output: {},
    }
    forEachKeyValue(this._input, (input, inputId) => {
      data.input[inputId] = input.peak()
    })
    forEachKeyValue(this._output, (output, outputId) => {
      data.output[outputId] = output.peak()
    })
    return data
  }

  public getInputData(): Dict<any> {
    const data: Dict<any> = {}
    forEachKeyValue(this._input, (input, inputId) => {
      if (!input.empty()) {
        const datum = input.peak()
        data[inputId] = datum
      }
    })
    return data
  }

  public getRefInputData(): Dict<U> {
    const data: Dict<any> = {}
    forEachKeyValue(this._ref_input, (input, inputId) => {
      if (!input.empty()) {
        let datum = input.peak()
        data[inputId] = datum
      }
    })
    return data
  }
}
