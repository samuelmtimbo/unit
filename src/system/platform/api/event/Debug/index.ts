import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { EE } from '../../../../../types/interface/EE'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_DEBUG } from '../../../../_ids'

export interface I<T> {
  data: any
  event: string
  unit: EE<any>
}

export interface O<T> {
  data: any
}

export default class Debug<T> extends Semifunctional<I<T>, O<T>> {
  private _listener: ((data: any) => void) | undefined

  private _unlisten: Unlisten | undefined = undefined

  constructor(system: System) {
    super(
      {
        fi: ['unit', 'event'],
        fo: [],
        i: ['remove'],
        o: ['data'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_DEBUG
    )

    this.addListener('destroy', () => {
      if (this._listener) {
        this._remove()

        this._forward_empty('data')
      }
    })
  }

  private _remove = () => {
    this._unlisten()

    this._listener = undefined
    this._unlisten = undefined
  }

  f({ unit, event }: I<T>) {
    const listener = (data: any) => {
      this._output.data.push(data)
    }
    this._listener = listener

    const emitter = unit

    this._unlisten = emitter.addListener(event, this._listener)
  }

  d() {
    this._remove()

    this._forward_empty('data')
  }

  onIterDataInputData(name: string, data: any) {
    // if (name === 'remove') {
    if (this._listener) {
      this._remove()
      this._done()
    }
    // }
  }
}
