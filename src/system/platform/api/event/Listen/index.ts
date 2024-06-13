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
  }

  f({ emitter, event }: I<T>) {
    const listener = (...data: any[]) => {
      if (this._paused) {
        return
      }

      this._output.data.push(data[0])
    }

    this._unlisten = emitter.addListener(event, listener)
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }

    this._forward_empty('data')
  }

  onIterDataInputData(name: string, data: any) {
    // if (name === 'remove') {
    if (this._unlisten) {
      this.d()

      this._done()
    }
    // }
  }
}
