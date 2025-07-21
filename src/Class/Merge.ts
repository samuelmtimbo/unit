import { Pin } from '../Pin'
import { PinOpt } from '../PinOpt'
import { Primitive } from '../Primitive'
import { isPrimitive } from '../spec/primitive'
import { System } from '../system'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { Dict } from '../types/Dict'
import { Key } from '../types/Key'

export const ID_SYSTEM_MERGE = '_d2c4b19b-aa58-438b-8541-9df478b80aa3'

export default class Merge<
  T = any,
  I extends Dict<T> = any,
  O extends Dict<T> = any,
> extends Primitive<I, O> {
  private _current: keyof I | undefined = undefined

  private _loop_invalid_o: Set<Key> = new Set()

  constructor(system: System) {
    super({}, {}, system, ID_SYSTEM_MERGE)

    this.addListener('reset', this._reset)
  }

  onInputRemoved<K extends keyof I>(
    name: K,
    input: Pin<any>,
    propagate: boolean
  ) {
    super.onInputRemoved(name, input, propagate)

    if (name === this._current) {
      this._current = undefined

      if (propagate) {
        this._forward_all_empty()
      }
    }
  }

  public onInputRenamed<K extends keyof I>(
    name: K,
    newName: K,
    opt: PinOpt,
    newOpt: PinOpt
  ): void {
    super.onInputRenamed(name, newName, opt, newOpt)

    const input = this.getInput(newName)

    if (!input.empty() || name === this._current) {
      this._current = newName
    }
  }

  public onOutputRenamed<K extends keyof O>(
    name: K,
    newName: K,
    opt: PinOpt,
    newOpt: PinOpt
  ): void {
    super.onOutputRenamed(name, newName, opt, newOpt)
  }

  public onInputSet<K extends keyof I>(
    name: K,
    input: Pin<any>,
    opt: PinOpt,
    propagate: boolean
  ): void {
    super.onInputSet(name, input, opt, propagate)

    if (!input.empty()) {
      this._current = name
    }
  }

  public onOutputSet<K extends keyof O>(
    name: K,
    output: Pin<any>,
    opt: PinOpt,
    propagate: boolean
  ): void {
    super.onOutputSet(name, output, opt, propagate)

    if (this._current !== undefined) {
      const data = this._i[this._current]

      if (propagate && data !== undefined) {
        this._forward_(output, data)
        this._backward_if_ready()
      }
    }
  }

  onOutputRemoved<K extends keyof O>(name: K, output: Pin, propagate: boolean) {
    if (propagate) {
      this._backward_if_ready()
    }
  }

  private _on_input_data<K extends keyof I>(name: K): void {
    // console.log('Merge', '_on_input_data', name)

    const current = this._current
    const invalid = this._i_invalid.has(current)
    const override = current !== undefined && name !== current && !invalid
    const invalidate =
      override || this._o_active.size - this._loop_invalid_o.size > 0

    if (invalidate) {
      this._invalidate()
    }

    this._current = name

    if (
      !this._backwarding &&
      !this._forwarding &&
      this._o_active.size - this._o_invalid.size === 0 &&
      this._o_count > 0
    ) {
      this._loop_invalid_o = new Set()

      this._run()
    }

    if (override) {
      this._backward(current)
    }
  }

  onDataInputData<K extends keyof I>(name: K) {
    this._on_input_data(name)
  }

  onRefInputData<K extends keyof I>(name: K) {
    this._on_input_data(name)
  }

  onDataInputDrop<K extends keyof I>(name: K) {
    if (name === this._current) {
      this._current = undefined
      if (!this._backwarding && this._i_start.size === 0) {
        this._forward_all_valid_empty()
      }
    }
  }

  private _on_output_drop<K extends keyof O>(name: K) {
    if (this._loop_invalid_o.has(name)) {
      this._loop_invalid_o.delete(name)
    }

    this._backward_if_ready()
    this._forward_if_ready()
  }

  public onOutputInvalid(name: string): void {
    if (this._current !== undefined && !this._forwarding) {
      this._loop_invalid_o.add(name)
    }
  }

  public onDataOutputData<K extends keyof O>(name: K): void {
    this._backward_if_ready()
  }

  onDataOutputDrop<K extends keyof O>(name: K) {
    this._on_output_drop(name)
  }

  onRefOutputDrop<K extends keyof O>(name: K) {
    this._on_output_drop(name)
  }

  public onDataInputStart<K extends keyof I>(name: K): void {
    if (this._i_start.size === 1) {
      this._start()
    }
  }

  public onDataInputInvalid<K extends keyof I>(name: K): void {
    if (name === this._current) {
      this._invalidate()
    }
  }

  public onDataInputEnd(name: string): void {
    if (this._i_start.size === 0) {
      if (this._current !== undefined) {
        this._forward_all_valid_empty()
      }
      this._end()
    }
  }

  private _forward_all_valid_empty() {
    this._forwarding_empty = true
    forEachValueKey(
      this._output,
      (o, name) =>
        (!this._loop_invalid_o.has(name) || this._o_invalid.has(name)) &&
        o.take()
    )
    this._forwarding_empty = false

    this._loop_invalid_o = new Set()
  }

  private _reset = (): void => {
    this._current = undefined
  }

  private _forward_if_ready() {
    if (
      !this._backwarding &&
      !this._forwarding &&
      this._o_active.size - this._o_invalid.size === 0 &&
      this._current !== undefined
    ) {
      this._loop_invalid_o = new Set()

      this._run()
    }
  }

  private _backward_if_ready() {
    if (
      !this._forwarding &&
      this._current !== undefined &&
      this._o_count > 0 &&
      this._o_active.size - this._loop_invalid_o.size === 0
    ) {
      this._loop_invalid_o = new Set()

      this._backward(this._current)

      if (
        !this._forwarding &&
        this._o_count > 0 &&
        this._current !== undefined
      ) {
        this._loop_invalid_o = new Set()

        this._run()
      }
    }
  }

  private _run() {
    const data = this._i[this._current!]
    this._forwarding = true
    for (const name in this._output) {
      const output = this._output[name]
      output.push(data)
    }
    this._forwarding = false
    this._backward_if_ready()
  }

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      ...(this._current !== undefined
        ? { _current: isPrimitive(this._current) ? this._current : undefined }
        : {}),
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { _current, ...rest } = state

    super.restoreSelf(rest)

    this._current = _current
  }

  public getData() {
    if (this._current) {
      return this._i[this._current]
    }

    return undefined
  }
}
