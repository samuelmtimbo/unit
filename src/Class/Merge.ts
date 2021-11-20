import { CLASS_TYPE_BLUETOOTH_CHARACTERISTIC } from '../class'
import { Pin } from '../Pin'
import { Primitive } from '../Primitive'
import { System } from '../system'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import { filterObj } from '../util/object'

export interface I<T> {
  [name: string]: T
}

export interface O<T> {
  [name: string]: T
}

export default class Merge<T = any> extends Primitive<I<T>, O<T>> {
  private _current: string | undefined = undefined

  constructor(system: System = null) {
    super({}, {}, system)

    this.addListener('reset', this._reset)
    this.addListener('play', this._play)
  }

  onInputRemoved(name: string) {
    if (name === this._current) {
      this._current = undefined
    }
  }

  // public onInputSet(name: string, input: Pin<any>): void {
  //   if (!input.empty()) {
  //     if (this._current !== undefined) {
  //       this._invalidate()
  //     }
  //     this._forward_if_ready()
  //   }
  // }

  public onOutputSet(name: string, output: Pin<any>): void {
    if (this._current !== undefined) {
      const data = this._i[this._current]
      if (output.peak() === data) {
        return
      }
      this._forward_(output, data)
      this._backward_if_ready()
    }
  }

  onOutputRemoved(name: string) {}

  private _on_input_data(name: string): void {
    // console.log('Merge', '_on_input_data', name)
    const current = this._current
    const invalid = this._i_invalid[current]
    const override = current !== undefined && name !== current && !invalid
    const invalidate = override || this._active_o_count > 0
    if (invalidate) {
      // this._looping = false
      this._invalidate()
    }
    this._current = name
    this._forward_if_ready()
    if (override) {
      this._backward(current)
      // this._looping = false
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
        // this._looping = false
        this._forward_all_empty()
      }
    }
  }

  private _on_output_drop(name: string) {
    this._backward_if_ready()
    this._forward_if_ready()
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
      // this._looping = false
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
        this._forward_all_empty()
      }
      this._end()
    }
  }

  private _reset = (): void => {
    this._current = undefined
  }

  private _play = (): void => {
    // console.log('Merge', '_play')
    this._forward_if_ready()
  }

  private _forward_if_ready() {
    while (
      !this._backwarding &&
      !this._forwarding &&
      this._active_o_count - this._o_invalid_count === 0 &&
      this._o_count > 0 &&
      this._current !== undefined &&
      !this._i_invalid[this._current]
    ) {
      this._run()
    }
  }

  private _backward_if_ready() {
    if (
      !this._forwarding &&
      this._current !== undefined &&
      this._active_o_count === 0
    ) {
      this._backward(this._current)
      this._forward_if_ready()
    }
  }

  private _run() {
    // console.log('Merge', '_run')
    const data = this._i[this._current!]
    const output_empty = filterObj(this._output, (o) => o.empty())
    const output_not_empty = filterObj(this._output, (o) => !o.empty())
    this._forwarding = true
    forEachKeyValue(output_empty, (o) => o.push(data))
    forEachKeyValue(output_not_empty, (o) => o.push(data))
    this._forwarding = false
    this._backward_if_ready()
  }
}
