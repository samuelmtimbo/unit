import { $ } from '../$'
import { SELF } from '../../constant/SELF'
import { DuplicatedInputFoundError } from '../../exception/DuplicatedInputFoundError'
import { DuplicatedOutputFoundError } from '../../exception/DuplicatedOutputFoundError'
import { InputNotFoundError } from '../../exception/InputNotFoundError'
import { InvalidArgumentType } from '../../exception/InvalidArgumentType'
import { OutputNotFoundError } from '../../exception/OutputNotFoundError'
import { PO } from '../../interface/PO'
import { U } from '../../interface/U'
import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { PinOpts } from '../../PinOpts'
import { Pins } from '../../Pins'
import forEachKeyValue from '../../system/core/object/ForEachKeyValue/f'
import { Dict } from '../../types/Dict'
import { None } from '../../types/None'
import { Unlisten } from '../../Unlisten'
import { pull, push, removeAt } from '../../util/array'
import { mapObj } from '../../util/object'
import { Config } from './Config'

export type PinMap<T> = Dict<Pin<T[keyof T]>>

const toPinMap = <T>(
  names: string[]
): {
  [name: string]: Pin<T>
} => {
  return names.reduce(
    (acc, name) => ({
      ...acc,
      [name]: new Pin(),
    }),
    {}
  )
}

export interface IO {
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

export class Unit<I = any, O = any> extends $ implements U {
  _: string[] = ['U']

  public $pod: PO
  public $parent: U | null = null
  public $path: string[] = []
  public $id: string | null = null

  public _input: Pins<any> = {}
  public _output: Pins<any> = {}

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

  protected _config: Config = {}

  protected _err: string | null = null

  protected _selfPin: Pin<U>

  public ref: any | null = null

  public _ready: boolean = true

  public _paused: boolean = false

  constructor({ i = [], o = [] }: IO, config: Config = {}, opt: Opt = {}) {
    super()

    const { input, output } = opt

    const inputMap = toPinMap<I[keyof I]>(i)
    const outputMap = toPinMap<O[keyof O]>(o)

    this.setInputs(inputMap, input)
    this.setOutputs(outputMap, output)

    this._config = config

    const { catchErr = false, paused = false } = this._config

    this._catchErr = !!catchErr
    this._paused = !!paused

    this._selfPin = new Pin<U>({ value: this, constant: false })
    this._selfPin.addListener('drop', () => {
      throw new Error('Self Pin should never be dropped!')
    })
  }

  public setParent(parent: U | null) {
    this.$parent = parent
    this.emit('parent', this.$parent)
  }

  public setPinIgnored(
    type: 'input' | 'output',
    name: string,
    ignored: boolean
  ): void {
    if (type === 'input') {
      this.setInputIgnored(name, ignored)
    } else {
      this.setOutputIgnored(name, ignored)
    }
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
    this._input = this._input || {}
    for (let name in inputs) {
      const input = inputs[name]
      const opt = opts[name]
      this.setInput(name, input, opt)
    }
  }

  public setPin(
    name: string,
    type: 'input' | 'output',
    pin: Pin<any>,
    opt: PinOpt = DEFAULT_PIN_OPT
  ) {
    if (type === 'input') {
      this.setInput(name, pin as Pin<I[keyof I]>, opt)
    } else {
      this.setOutput(name, pin as Pin<O[keyof O]>, opt)
    }
  }

  public setInput(
    name: string,
    input: Pin<I[keyof I]>,
    opt: PinOpt = DEFAULT_PIN_OPT
  ) {
    this._setInput(name, input, opt)

    this.emit('set_input', name, input, opt)
  }

  public _setInput(
    name: string,
    input: Pin<I[keyof I]>,
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
      this._r_i_count++
      this._r_i_name.add(name)
      this._ref_input[name] = input
    } else {
      this._d_i_count++
      this._d_i_name.add(name)
      this._data_input[name] = input
    }
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
      this._r_i_count--
      this._r_i_name.delete(name)
      delete this._ref_input[name]
    } else {
      this._d_i_count--
      this._d_i_name.delete(name)
      delete this._data_input[name]
    }

    this.emit('remove_input', name, input)
  }

  public setOutputs(outputs: Pins<O>, opts: PinOpts = {}): void {
    this._output = this._output || {}
    for (let name in outputs) {
      const output = outputs[name]
      const opt = opts[name]
      this.setOutput(name, output, opt)
    }
  }

  public setOutput(
    name: string,
    output: Pin<any>,
    opt: PinOpt = DEFAULT_PIN_OPT
  ) {
    this._setOutput(name, output, opt)

    this.emit('set_output', name, output, opt)
  }

  public _setOutput(
    name: string,
    output: Pin<any>,
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
      this._r_o_count++
      this._r_o_name.add(name)
      this._ref_output[name] = output
    } else {
      this._d_o_count++
      this._d_o_name.add(name)
      this._data_output[name] = output
    }

    this._output[name] = output
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

  public removeOutput(name: string): void {
    if (!this.hasOutputNamed(name)) {
      throw new OutputNotFoundError(name)
    }

    this._o_count--
    this._o_name_set.delete(name)

    const opt = this._o_opt[name]

    const { ref } = opt

    if (ref) {
      this._r_o_count--
      this._r_o_name.delete(name)
      delete this._ref_output[name]
    } else {
      this._d_o_count--
      this._d_o_name.delete(name)
      delete this._data_output[name]
    }

    const output = this._output[name]

    delete this._output[name]

    this.emit('remove_output', name, output)
  }

  public removePin(name: string, type: 'input' | 'output') {
    if (type === 'input') {
      this.removeInput(name)
    } else {
      this.removeOutput(name)
    }
  }

  public getPin(type: 'input' | 'output', pinId: string) {
    if (type === 'input') {
      return this.getInput(pinId)
    } else {
      return this.getOutput(pinId)
    }
  }

  public getInputs(): Pins<Partial<I>> {
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

  public getOutputs(): Pins<Partial<O>> {
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
    return mapObj(this._output, (output) => output.take())
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
    return mapObj(this._output, (pin) => pin.peak())
  }

  public peakAll(): Dict<any> {
    return this.peakAllOutput()
  }

  public hasPinNamed(type: 'input' | 'output', name: string): boolean {
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

  public hasRefPinNamed(type: 'input' | 'output', name: string): boolean {
    if (type === 'input') {
      return this.hasRefInputNamed(name)
    } else {
      return this.hasRefOutputNamed(name)
    }
  }

  public hasRefInputNamed(name: string): boolean {
    return this._r_i_name.has(name)
  }

  public renameInput(name: string, newName: string): void {
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
      this._data_input[name] = input
    }

    this.emit('rename_input', name, newName)
  }

  public renameOutput(name: string, newName: string): void {
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
      this._data_output[name] = output
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

  public setPinData(type: 'input' | 'output', pinId: string, data: any): void {
    const pin = this.getPin(type, pinId)
    pin.push(data)
  }

  public removePinData(type: 'input' | 'output', pinId: string): void {
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
      this._caughtErr = null
      this._catcherDoneCount = 0
      this._catcherDone.fill(false)

      this.emit('take_caught_err')
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
            this.emit('take_caught_err')
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

  public getConfig(): Config {
    return this._config
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
