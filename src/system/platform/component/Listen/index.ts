import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'
import { Unlisten } from '../../../../Unlisten'

export interface I<T> {
  method: string
  data: any
  unit: Unit
}

export interface O<T> {
  data: any
}

export default class Listen<T> extends Primitive<I<T>, O<T>> {
  private _event: string | undefined
  private _unit: Unit | undefined

  private _listener: ((data: any) => void) | undefined

  private _unlisten: Unlisten | undefined = undefined

  constructor(config?: Config) {
    super(
      {
        i: ['unit', 'event', 'remove'],
        o: ['data'],
      },
      config
    )

    this.addListener('destroy', () => {
      this._remove()
    })
  }

  private _remove = () => {
    if (this._unit && this._event && this._listener && this._unlisten) {
      this._unlisten()

      this._listener = undefined
      this._event = undefined
      this._unit = undefined
      this._unlisten = undefined
    }
  }

  onDataInputData(name: string, event: string) {
    if (name === 'unit' || name === 'event') {
      this._forward_if_ready()
    } else {
      // name === 'remove'
      if (this._listener) {
        this._remove()
      }
      this._input.event.pull()
      this._input.remove.pull()
    }
  }

  onDataInputDrop(name: string) {
    if (name === 'unit' || name === 'event') {
      this._remove()
      this._forward_all_empty()
    }
  }

  onDataInputInvalid(name: string): void {
    this._remove()
    this._invalidate()
  }

  private _forward_if_ready = () => {
    while (
      !this._unit &&
      !this._input.unit.empty() &&
      !this._input.event.empty()
    ) {
      this._forward()
    }
  }

  private _forward = () => {
    const event = this._input.event.peak()
    const unit = this._input.unit.peak() as Unit

    this._event = event
    this._unit = unit

    const listener = (data: any) => {
      this._output.data.push(data)
    }
    this._listener = listener

    this._unlisten = unit.listen(event, this._listener)
  }
}
