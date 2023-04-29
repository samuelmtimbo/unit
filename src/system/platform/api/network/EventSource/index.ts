import { $, $Events, $_EE } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { EventEmitter_EE } from '../../../../../EventEmitter'
import { System } from '../../../../../system'
import { EE } from '../../../../../types/interface/EE'
import { Listener } from '../../../../../types/Listener'
import { Unlisten } from '../../../../../types/Unlisten'
import { ID_EVENT_SOURCE } from '../../../../_ids'

export type I = {
  url: string
  close: any
}

export type O = {
  emitter: $ & EE
}

export default class EventSource_ extends Semifunctional<I, O> {
  private _event_source: EventSource = null

  constructor(system: System) {
    super(
      {
        fi: ['url'],
        fo: ['emitter'],
        i: ['close'],
        o: [],
      },
      {
        output: {
          emitter: {
            ref: true,
          },
        },
      },
      system,
      ID_EVENT_SOURCE
    )
  }

  f({ url }: I, done: Done<O>) {
    const {
      api: {
        http: { EventSource },
      },
    } = this.__system

    const event_source = new EventSource(url)

    this._event_source = event_source

    event_source.onerror = (err) => {
      this._pluck()
      done(undefined, 'error connecting to server')
    }

    event_source.onopen = () => {
      const emitter = new (class EventEmitter__ extends $ {
        addListener<K extends keyof EventEmitter_EE<$_EE> | 'destroy'>(
          event: K,
          listener: Listener<$Events<$_EE>[K]>
        ): Unlisten {
          super.addListener(event, listener)

          const _listener = (event: MessageEvent) => {
            // @ts-ignore
            listener(event.data)
          }

          event_source.addEventListener(event, _listener)

          return () => {
            event_source.removeEventListener(event, _listener)
          }
        }
      })(this.__system)

      // @ts-ignore
      done({ emitter })
    }
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'close') {
    this._pluck()
    // }
  }

  private _pluck = () => {
    this._event_source.close()

    this._event_source = null
  }
}
