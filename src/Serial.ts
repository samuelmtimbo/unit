import { Config } from './Class/Unit/Config'
import { Pin } from './Pin'
import { Primitive } from './Primitive'
import { forEach } from './util/array'

export interface I<T> {
  a: T
}

export interface O<T> {
  first: T
  second: T
}

export default class Serial<T> extends Primitive<I<T>, O<T>> {
  private _current: T | undefined = undefined
  private _index: number | undefined = undefined

  private _o_name: string[] = ['a']

  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: [],
      },
      config
    )

    // adding the first output will forward the current data to it
    this.addListener('set_output', (name: string, output: Pin<T>) => {
      if (this._current !== undefined) {
        this._forwarding = true
        if (this._o_count === 1) {
          output.push(this._current)
        }
        this._forwarding = false
      }

      this._o_name = Array.from(this._o_name_set).sort()
    })

    this.addListener('reset', () => {
      this._current = undefined
      this._index = undefined
    })
  }

  protected _forward_all_empty(from: number = 0) {
    this._forwarding_empty = true
    forEach(this._o_name, (name: string, index: number) => {
      if (index >= from) {
        this._output[name].pull()
      }
    })
    this._forwarding_empty = false
  }

  private _current_name(): string {
    const current_name = this._o_name[this._index!]
    return current_name
  }

  private _output_current(): void {
    const current_name = this._current_name()
    const pin = this._output[current_name]
    pin.push(this._current)
  }

  onDataInputData(name: string, data: any) {
    if (this._index !== undefined) {
      this._forward_all_empty(1)
    }
    this._index = 0
    this._current = data
    if (this._o_count > 0) {
      this._output_current()
    }
  }

  onDataInputDrop(name: string) {
    this._index = undefined
    this._forward_all_empty()
  }

  onDataOutputDrop(name: string) {
    if (!this._forwarding_empty) {
      if (this._index! < this._o_count - 1) {
        this._index!++
        this._output_current()
      } else {
        this._index = undefined
        this._current = undefined
        this._input.a.pull()
      }
    }
  }
}
