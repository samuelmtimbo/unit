import { Pin } from '../Pin'
import { PinOpt } from '../PinOpt'
import { Primitive } from '../Primitive'
import { isPrimitive } from '../spec/primitive'
import { System } from '../system'
import forEachValueKey from '../system/core/object/ForEachKeyValue/f'
import { Dict } from '../types/Dict'
import { filterObj } from '../util/object'

export interface I<T> {
  [name: string]: T
}

export interface O<T> {
  [name: string]: T
}

export const ID_SYSTEM_MERGE = '_d2c4b19b-aa58-438b-8541-9df478b80aa3'

export default class Merge<T = any> extends Primitive<I<T>, O<T>> {
  private _current: string | undefined = undefined

  constructor(system: System) {
    super({}, {}, system, ID_SYSTEM_MERGE)

    this.addListener('reset', this._reset)
    this.addListener('play', this._play)

    this.play()
  }

  onInputRemoved(name: string, input: Pin<any>) {
    super.onInputRemoved(name, input)

    if (name === this._current) {
      this._current = undefined
    }
  }

  public onInputRenamed(
    name: string,
    newName: string,
    opt: PinOpt,
    newOpt: PinOpt
  ): void {
    super.onInputRenamed(name, newName, opt, newOpt)

    const input = this.getInput(newName)

    if (!input.empty() || name === this._current) {
      this._current = newName
    }
  }

  public onOutputRenamed(
    name: string,
    newName: string,
    opt: PinOpt,
    newOpt: PinOpt
  ): void {
    super.onOutputRenamed(name, newName, opt, newOpt)
  }

  public onInputSet(
    name: string,
    input: Pin<any>,
    opt: PinOpt,
    propagate: boolean
  ): void {
    super.onInputSet(name, input, opt, propagate)

    if (!input.empty()) {
      this._current = name
    }
  }

  public onOutputSet(
    name: string,
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

  onOutputRemoved(name: string) {}

  private _on_input_data(name: string): void {
    // console.log('Merge', '_on_input_data', name)

    const current = this._current
    const invalid = this._i_invalid[current]
    const override = current !== undefined && name !== current && !invalid
    const invalidate =
      override || this._active_o_count - this._loop_invalid_o_count > 0

    if (invalidate) {
      this._invalidate()
    }

    this._current = name

    this._forward_if_ready()

    if (override) {
      // this._loop_invalid_o_count = 0
      // this._loop_invalid_o = new Set()

      this._backward(current)
    }
  }

  onDataInputData(name: string) {
    this._on_input_data(name)
  }

  onRefInputData(name: string) {
    this._on_input_data(name)
  }

  onDataInputDrop(name: string) {
    if (name === this._current) {
      this._current = undefined
      if (!this._backwarding && this._i_start_count === 0) {
        this._forward_all_valid_empty()
      }
    }
  }

  private _on_output_drop(name: string) {
    if (this._loop_invalid_o.has(name)) {
      this._loop_invalid_o.delete(name)
      this._loop_invalid_o_count--
    }

    this._backward_if_ready()
    this._forward_if_ready()
  }

  private _loop_invalid_o_count: number = 0
  private _loop_invalid_o: Set<string> = new Set()

  public onOutputInvalid(name: string): void {
    if (this._current !== undefined && !this._forwarding) {
      this._loop_invalid_o_count++
      this._loop_invalid_o.add(name)
    }
  }

  public onDataOutputData(name: string): void {
    this._backward_if_ready()
  }

  onDataOutputDrop(name: string) {
    this._on_output_drop(name)
  }

  onRefOutputDrop(name: string) {
    this._on_output_drop(name)
  }

  public onDataInputStart(name: string): void {
    if (this._i_start_count === 1) {
      this._start()
    }
  }

  public onDataInputInvalid(name: string): void {
    if (name === this._current) {
      this._invalidate()
    }
  }

  public onInpuRemoved(name: string): void {
    if (name === this._current) {
      this._current = undefined
    }
  }

  public onDataInputEnd(name: string): void {
    if (this._paused) {
      return
    }
    if (this._i_start_count === 0) {
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
        (!this._loop_invalid_o.has(name) || this._o_invalid[name]) && o.take()
    )
    this._forwarding_empty = false

    this._loop_invalid_o_count = 0
    this._loop_invalid_o = new Set()
  }

  private _reset = (): void => {
    this._current = undefined
  }

  private _play = (): void => {
    this._forward_if_ready()
  }

  private _forward_if_ready() {
    if (
      !this._backwarding &&
      !this._forwarding &&
      this._active_o_count - this._o_invalid_count === 0 &&
      this._o_count > 0 &&
      this._current !== undefined &&
      !this._i_invalid[this._current]
    ) {
      this._loop_invalid_o_count = 0
      this._loop_invalid_o = new Set()

      this._run()
    }
  }

  private _backward_if_ready() {
    if (
      !this._forwarding &&
      this._current !== undefined &&
      this._active_o_count - this._loop_invalid_o_count === 0
    ) {
      this._loop_invalid_o_count = 0
      this._loop_invalid_o = new Set()

      this._backward(this._current)
      this._forward_if_ready()
    }
  }

  private _run() {
    const data = this._i[this._current!]
    const output_empty = filterObj(this._output, (o) => o.empty())
    const output_not_empty = filterObj(this._output, (o) => !o.empty())
    this._forwarding = true
    forEachValueKey(output_empty, (o) => o.push(data))
    forEachValueKey(output_not_empty, (o) => o.push(data))
    this._forwarding = false
    this._backward_if_ready()
  }

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      _current: isPrimitive(this._current) ? this._current : undefined,
      _loop_invalided_o_count: this._loop_invalid_o_count,
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { _current, _loop_invalided_o_count, ...rest } = state

    super.restoreSelf(rest)

    this._current = _current
    this._loop_invalid_o_count = _loop_invalided_o_count
  }

  public getData() {
    if (this._current) {
      return this._i[this._current]
    }

    return undefined
  }
}
