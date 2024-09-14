import { ION, Opt, Unit, UnitEvents } from './Class/Unit'
import { Pin } from './Pin'
import { PinOpt } from './PinOpt'
import { Pins } from './Pins'
import { System } from './system'
import forEachValueKey from './system/core/object/ForEachKeyValue/f'
import { Dict } from './types/Dict'
import { IO } from './types/IO'
import { Key } from './types/Key'
import { Unlisten } from './types/Unlisten'

export type Primitive_EE = {}

export type PrimitiveEvents<_EE extends Dict<any[]>> = UnitEvents<
  _EE & Primitive_EE
> &
  Primitive_EE

export class Primitive<
  I extends Dict<any> = any,
  O extends Dict<any> = any,
  _EE extends PrimitiveEvents<_EE> &
    Dict<any[]> = PrimitiveEvents<Primitive_EE>,
> extends Unit<I, O, _EE> {
  protected _i: Partial<I> = {}

  public _o_active: Set<Key> = new Set()
  public _i_active: Set<Key> = new Set()

  public _i_start: Set<Key> = new Set()

  public _o_invalid: Set<keyof O> = new Set()
  public _i_invalid: Set<keyof I> = new Set()

  public _forwarding: boolean = false
  public _backwarding: boolean = false
  public _forwarding_empty: boolean = false

  private _inputUnlisten: Partial<Record<keyof I, Unlisten>> = {}
  private _outputUnlisten: Partial<Record<keyof O, Unlisten>> = {}

  private __buffer: {
    name: Key
    type: IO
    event: 'data' | 'drop'
    ref: boolean
    data?: any
  }[] = []

  constructor(
    { i, o }: ION<I, O> = {},
    opt: Opt = {},
    system: System,
    id: string
  ) {
    super({ i, o }, opt, system, id)

    this._setupInputs(this._input)
    this._setupOutputs(this._output)

    this.addListener('set_input', this._onInputSet)
    this.addListener('set_output', this._onOutputSet)
    this.addListener('remove_input', this._onInputRemoved)
    this.addListener('remove_output', this._onOutputRemoved)
    this.addListener('rename_input', this._onInputRenamed)
    this.addListener('rename_output', this._onOutputRenamed)
    this.addListener('destroy', () => {
      forEachValueKey(this._input, (input: Pin<any>, name: keyof I) => {
        this._plunkInput(name, input)
      })
      forEachValueKey(this._output, (output: Pin<any>, name: keyof O) => {
        this._plunkOutput(name, output)
      })
    })
    this.addListener('reset', () => {
      this._backwarding = false
      this._forwarding = false
      this._forwarding_empty = false

      this.__buffer = []
    })

    this.addListener('play', () => {
      while (this.__buffer.length > 0) {
        const { name, type, event, data } = this.__buffer.shift()!

        if (type === 'input') {
          const { ref } = this.getInputOpt(name as keyof I)

          if (event === 'data') {
            if (ref) {
              this.__onRefInputData(name as keyof I, data)
            } else {
              this.onDataInputData(name as keyof I, data)
            }
          } else {
            if (ref) {
              this.__onRefInputDrop(name as keyof I, data)
            } else {
              this.onDataInputDrop(name as keyof I, data)
            }
          }
        } else {
          if (event === 'drop') {
            this.onDataOutputDrop(name as keyof O)
          }
        }
      }
    })
  }

  public getActiveInputCount(): number {
    return this._i_active.size
  }

  public getActiveOutputCount(): number {
    return this._o_active.size
  }

  private _plunkOutput<K extends keyof O>(name: K, output: Pin<O[K]>): void {
    const unlisten = this._outputUnlisten[name]

    unlisten && unlisten()

    delete this._outputUnlisten[name]
  }

  private _plunkInput<K extends keyof I>(name: K, input: Pin<I[K]>): void {
    const unlisten = this._inputUnlisten[name]

    unlisten && unlisten()

    delete this._inputUnlisten[name]

    delete this._i[name]

    this._i_active.delete(name)
    this._i_start.delete(name)
    this._i_invalid.delete(name)
  }

  private _setupInputs = (inputs: Pins<I>) => {
    for (const name in inputs) {
      const input = inputs[name]

      const opt = this.getInputOpt(name)

      this._setupInput(name, input, opt)
    }
  }

  private _setupDataInput = <K extends keyof I>(
    name: K,
    input: Pin<I[keyof I]>
  ): void => {
    const dataListener = this._onDataInputData.bind(this, name)
    const dropListener = this._onDataInputDrop.bind(this, name)
    const invalidListener = this._onDataInputInvalid.bind(this, name)
    const startListener = this._onInputStart.bind(this, name)
    const endListener = this._onInputEnd.bind(this, name)

    input.addListener('_data', dataListener)
    input.addListener('data', dataListener)
    input.addListener('start', startListener)
    input.addListener('invalid', invalidListener)

    input.prependListener('drop', dropListener)
    input.prependListener('end', endListener)

    const unlisten = () => {
      input.removeListener('data', dataListener)
      input.removeListener('start', startListener)
      input.removeListener('invalid', invalidListener)
      input.removeListener('drop', dropListener)
      input.removeListener('end', endListener)
    }

    this._inputUnlisten[name] = unlisten
  }

  private _setupRefInput = <K extends keyof I>(
    name: K,
    input: Pin<I[keyof I]>
  ): void => {
    const dataListener = this._onRefInputData.bind(this, name)
    const dropListener = this._onRefInputDrop.bind(this, name)
    const invalidListener = this._onRefInputInvalid.bind(this, name)

    input.addListener('data', dataListener)
    input.addListener('invalid', invalidListener)

    input.prependListener('drop', dropListener)

    const unlisten = () => {
      input.removeListener('data', dataListener)
      input.removeListener('invalid', invalidListener)
      input.removeListener('drop', dropListener)
    }

    this._inputUnlisten[name] = unlisten
  }

  private _setupInput = <K extends keyof I>(
    name: K,
    input: Pin<I[K]>,
    opt: PinOpt
  ): void => {
    const { ref } = opt
    if (ref) {
      this._setupRefInput(name, input)
    } else {
      this._setupDataInput(name, input)
    }
  }

  private _setupOutputs = (outputs: Pins<O>) => {
    for (let name in outputs) {
      const output = outputs[name]
      const opt = this.getOutputOpt(name)
      this._setupOutput(name, output, opt)
    }
  }

  private __setupOutput = <K extends keyof O>(
    name: K,
    output: Pin<any>
  ): void => {
    const dataListener = this._onDataOutputData.bind(this, name)
    const dropListener = this._onDataOutputDrop.bind(this, name)
    const invalidListener = this._onOutputInvalid.bind(this, name)

    output.addListener('drop', dropListener)

    output.prependListener('data', dataListener)
    output.prependListener('invalid', invalidListener)

    const unlisten = () => {
      output.removeListener('data', dataListener)
      output.removeListener('drop', dropListener)
      output.removeListener('invalid', invalidListener)
    }

    this._outputUnlisten[name] = unlisten
  }

  private _setupDataOutput = <K extends keyof O>(
    name: K,
    output: Pin<any>
  ): void => {
    this.__setupOutput(name, output)

    if (output.active()) {
      const data = output.peak()

      this._onDataOutputData(name, data)
    }
  }

  private _setupRefOutput = <K extends keyof O>(
    name: K,
    output: Pin<any>
  ): void => {
    this.__setupOutput(name, output)

    if (output.active()) {
      const data = output.peak()

      this._onRefOutputData(name, data)
    }
  }

  private _setupOutput = <K extends keyof O>(
    name: K,
    output: Pin<any>,
    opt: PinOpt
  ): void => {
    const { ref } = opt
    if (ref) {
      this._setupRefOutput(name, output)
    } else {
      this._setupDataOutput(name, output)
    }
  }

  private _onDataInputData = <K extends keyof I>(name: K, data: any): void => {
    this._activateInput(name, data)

    if (!this._paused) {
      this.onDataInputData(name, data)
    } else {
      this.__buffer.push({
        name,
        type: 'input',
        event: 'data',
        data,
        ref: false,
      })
    }
  }

  private _onRefInputData = <K extends keyof I>(name: K, data: any): void => {
    this._activateInput(name, data)

    if (!this._paused) {
      this.__onRefInputData(name, data)
    } else {
      this.__buffer.push({
        name,
        type: 'input',
        event: 'data',
        data,
        ref: true,
      })
    }
  }

  private __onRefInputData = <K extends keyof I>(name: K, data: any): void => {
    this.onRefInputData(name, data)
  }

  private _onInputSet<K extends keyof I>(
    name: K,
    input: Pin<any>,
    opt: PinOpt,
    propagate: boolean
  ): void {
    this._setupInput(name, input, opt)

    this.onInputSet(name, input, opt, propagate)
  }

  public onInputSet<K extends keyof I>(
    name: K,
    input: Pin<any>,
    opt: PinOpt,
    propagate: boolean
  ): void {
    if (!input.empty()) {
      const data = input.peak()

      this._activateInput(name, data)

      if (propagate) {
        this._onInputStart(name)

        if (this.hasRefInputNamed(name)) {
          this._onRefInputData(name, data)
        } else {
          this._onDataInputData(name, data)
        }
      }
    }
  }

  private _onOutputSet<K extends keyof O>(
    name: K,
    output: Pin<O[K]>,
    opt: PinOpt,
    propagate: boolean
  ): void {
    this._setupOutput(name, output, opt)
    this.onOutputSet(name, output, opt, propagate)
  }

  public onOutputSet<K extends keyof O>(
    name: K,
    output: Pin<O[K]>,
    opt: PinOpt,
    propagate: boolean
  ): void {}

  private _onInputRemoved<K extends keyof I>(
    name: K,
    input: Pin<any>,
    propagate: boolean
  ): void {
    this._plunkInput(name, input)

    if (input.active()) {
      this._deactivateInput(name)
    }

    this.onInputRemoved(name, input, propagate)
  }

  public onInputRemoved<K extends keyof I>(
    name: K,
    input: Pin<any>,
    propagate: boolean
  ): void {
    // console.log(this.constructor.name, 'onInputRemoved', name)
  }

  public _onOutputRemoved<K extends keyof O>(
    name: K,
    output: Pin<O[K]>,
    propagate: boolean
  ): void {
    this._plunkOutput(name, output)

    if (!output.empty()) {
      this._deactivateOutput(name)
    }

    this.onOutputRemoved(name, output, propagate)
  }

  public onOutputRemoved<K extends keyof O>(
    name: K,
    output: Pin<O[K]>,
    propagate: boolean
  ): void {
    if (!output.empty()) {
      this._onDataOutputDrop(name)
    }
  }

  public onDataInputData<K extends keyof I>(name: K, data: any): void {}

  public onRefInputData(name, data: any): void {}

  private _onInputRenamed<K extends keyof I>(name: K, newName: K): void {
    // console.log('Primitive', '_onInputRenamed', name, newName)

    const input = this.getInput(newName)
    const opt = this.getInputOpt(newName)

    const data = this._i[name]

    const active = this._i_active.has(name)
    const start = this._i_start.has(name)
    const invalid = this._i_invalid.has(name)

    this._plunkInput(name, input)

    this._setupInput(newName, input, opt)

    this._i[newName] = data

    if (start) {
      this._i_start.add(newName)
    }
    if (active) {
      this._i_active.add(newName)
    }
    if (invalid) {
      this._i_invalid.add(newName)
    }

    this.onInputRenamed(name, newName, opt, opt)
  }

  private _onOutputRenamed<K extends keyof O>(name: K, newName: K) {
    // console.log('Primitive', '_onOutputRenamed', name, newName)

    const output = this.getOutput(newName)
    const opt = this.getOutputOpt(newName)

    this._plunkOutput(name, output)

    this._setupOutput(newName, output, opt)

    this._o_active.delete(name)

    this.onOutputRenamed(name, newName, opt, opt)
  }

  public onInputRenamed<K extends keyof I>(
    name: K,
    newName: K,
    opt: PinOpt,
    newOpt: PinOpt
  ): void {
    //
  }

  public onOutputRenamed<K extends keyof O>(
    name: K,
    newName: K,
    opt: PinOpt,
    newOpt: PinOpt
  ): void {
    //
  }

  private _activateInput = <K extends keyof I>(name: K, data: any) => {
    this._i_active.add(name)

    this._i[name] = data

    this._i_invalid.delete(name)
  }

  private _deactivateInput = <K extends keyof I>(name: K) => {
    delete this._i[name]

    this._i_active.delete(name)
    this._i_invalid.delete(name)
    this._i_start.delete(name)
  }

  private _onDataInputDrop = <K extends keyof I>(name: K, data: any): void => {
    this._deactivateInput(name)

    if (!this._paused) {
      this.onDataInputDrop(name, data)
    } else {
      this.__buffer.push({ name, type: 'input', event: 'drop', ref: false })
    }
  }

  private _onRefInputDrop = <K extends keyof I>(name: K, data: any): void => {
    this._deactivateInput(name)

    if (!this._paused) {
      this.__onRefInputDrop(name, data)
    } else {
      this.__buffer.push({ name, type: 'input', event: 'drop', ref: true })
    }
  }

  private __onRefInputDrop = <K extends keyof I>(name: K, data: any): void => {
    this.onRefInputDrop(name, data)
  }

  private _onRefInputInvalid = <K extends keyof I>(name: K): void => {
    this._i_invalid.add(name)

    this.onRefInputInvalid(name)
  }

  public onDataInputDrop<K extends keyof I>(name: K, data: any): void {}

  public onRefInputDrop<K extends keyof I>(name: K, data: any): void {}

  private _activateOutput = <K extends keyof O>(name: K) => {
    this._o_active.add(name)
    this._o_invalid.delete(name)
  }

  private _deactivateOutput = <K extends keyof O>(name: K) => {
    this._o_active.delete(name)
    this._o_invalid.delete(name)
  }

  private __onOutputData = <K extends keyof O>(name: K, data: any): void => {
    this._activateOutput(name)
  }

  private _onDataOutputData = <K extends keyof O>(name: K, data: any): void => {
    this.__onOutputData(name, data)

    this.onDataOutputData(name, data)
  }

  private _onRefOutputData = <K extends keyof O>(name: K, data: any): void => {
    this.__onOutputData(name, data)

    this.onRefOutputData(name, data)
  }

  private _onDataOutputDrop = <K extends keyof O>(name: K): void => {
    this._deactivateOutput(name)
    if (!this._paused) {
      this.onDataOutputDrop(name)
    } else {
      this.__buffer.push({ name, type: 'output', event: 'drop', ref: false })
    }
  }

  private _onRefOutputDrop = <K extends keyof O>(name: K): void => {
    this._deactivateOutput(name)
    if (!this._paused) {
      this.onRefOutputDrop(name)
    } else {
      this.__buffer.push({ name, type: 'output', event: 'drop', ref: true })
    }
  }

  public onDataOutputData<K extends keyof O>(name: K, data: any): void {}

  public onDataOutputDrop<K extends keyof O>(name: K): void {}

  public onRefOutputData<K extends keyof O>(name: K, data: any): void {}

  public onRefOutputDrop<K extends keyof O>(name: K): void {}

  public onOutputInvalid(name: string): void {}

  private _onOutputInvalid = (name: string): void => {
    this._o_invalid.add(name)

    this.onOutputInvalid(name)
  }

  private _onInputEnd(name: string): void {
    this._i_start.delete(name)

    this.onDataInputEnd(name)
  }

  public onDataInputEnd(name: string): void {}

  private _onInputStart<K extends keyof I>(name: K): void {
    this._i_start.add(name)

    this.onDataInputStart(name)
  }

  public onDataInputStart<K extends keyof I>(name: K): void {}

  private _onDataInputInvalid(name: string): void {
    this._i_invalid.add(name)

    this.onDataInputInvalid(name)
  }

  protected _start() {
    forEachValueKey(this._output, (output) => output.start())
  }

  protected _invalidate() {
    forEachValueKey(this._output, (output) => output.invalidate())
  }

  protected _end() {
    forEachValueKey(this._output, (output) => output.end())
  }

  protected _forward(name: string, data: any): void {
    const output = this._output[name]
    this._forward_(output, data)
  }

  protected _forward_(output: Pin, data: any): void {
    this._forwarding = true
    output.push(data)
    this._forwarding = false
  }

  protected _forward_all_empty(): void {
    this._forwarding_empty = true
    forEachValueKey(this._output, (o) => o.take())
    this._forwarding_empty = false
  }

  protected _forward_empty(name: keyof O): void {
    this._forwarding_empty = true
    const output = this._output[name]
    output.take()
    this._forwarding_empty = false
  }

  protected _backward_all(): void {
    this._backwarding = true
    forEachValueKey(this._data_input, (i) => i.pull())
    this._backwarding = false
  }

  protected _backward(name: keyof I): void {
    this._backwarding = true
    const input = this._input[name]
    input.pull()
    this._backwarding = false
  }

  public onDataInputInvalid<K extends keyof I>(name: K) {}

  public onRefInputInvalid<K extends keyof I>(name: K) {}

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      // __buffer: this.__buffer,
      _forwarding: this._forwarding,
      _backwarding: this._backwarding,
      _forwarding_empty: this._forwarding_empty,
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { __buffer, _forwarding, _backwarding, _forwarding_empty, ...rest } =
      state

    super.restoreSelf(rest)

    // this.__buffer = __buffer || []

    this._forwarding = _forwarding
    this._backwarding = _backwarding
    this._forwarding_empty = _forwarding_empty

    this._i = {}

    for (let name in this._input) {
      const input = this._input[name]
      const data = input.peak()

      this._i[name] = data

      if (data !== undefined) {
        this._i_active.add(name)
        this._i_start.add(name)

        if (input.invalid()) {
          this._i_invalid.add(name)
        }
      }
    }

    for (let name in this._output) {
      const output = this._output[name]
      const data = output.peak()

      if (data !== undefined) {
        this._o_active.add(name)

        if (output.invalid()) {
          this._o_invalid.add(name)
        }
      }
    }
  }
}
