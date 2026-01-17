import { $ } from '../../../../../Class/$'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { $EE } from '../../../../../types/interface/async/$EE'
import { Async } from '../../../../../types/interface/async/Async'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_LISTEN } from '../../../../_ids'

export interface I<T> {
  emitter: $EE & $
  event: string
  remove: string
}

export interface O<T> {
  data: any
}

export default class Listen<T> extends Holder<I<T>, O<T>> {
  private _unlisten: Unlisten | undefined = undefined

  constructor(system: System) {
    super(
      {
        fi: ['emitter', 'event'],
        fo: [],
        i: [],
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
      ID_LISTEN,
      'remove'
    )
  }

  f({ emitter, event }: I<T>) {
    emitter = Async(emitter, ['EE'], this.__system.async)

    const listener = (data: any) => {
      this._output.data.push(data)
    }

    this._unlisten = emitter.$addListener({ event }, (data) => {
      listener(data)
    })
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined

      this._forward_empty('data')
    }
  }
}
