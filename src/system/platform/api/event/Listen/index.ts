import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { EE } from '../../../../../types/interface/EE'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_LISTEN } from '../../../../_ids'

export interface I<T> {
  emitter: EE<any>
  event: string
  remove: string
}

export interface O<T> {
  data: any
}

export default class Listen<T> extends Semifunctional<I<T>, O<T>> {
  private _listener: ((data: any) => void) | undefined

  private _unlisten: Unlisten | undefined = undefined

  constructor(system: System) {
    super(
      {
        fi: ['emitter', 'event'],
        fo: [],
        i: ['remove'],
        o: ['data'],
      },
      {
        input: {
          emitter: {
            ref: true,
          },
        },
      },
      system,
      ID_LISTEN
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

  f({ emitter, event }: I<T>) {
    const listener = (...data: any[]) => {
      this._output.data.push(data[0])
    }
    this._listener = listener

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
