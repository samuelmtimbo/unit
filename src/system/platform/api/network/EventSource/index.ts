import { $, $Events, $_EE } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { EventEmitter_EE } from '../../../../../EventEmitter'
import { System } from '../../../../../system'
import { Listener } from '../../../../../types/Listener'
import { Unlisten } from '../../../../../types/Unlisten'
import { EE } from '../../../../../types/interface/EE'
import { ID_EVENT_SOURCE } from '../../../../_ids'

export type I = {
  url: string
  opt: EventSourceInit
  close: any
}

export type O = {
  emitter: $ & EE
}

export default class EventSource_ extends Holder<I, O> {
  private _event_source: EventSource = null

  constructor(system: System) {
    super(
      {
        fi: ['url', 'opt'],
        fo: ['emitter'],
        i: [],
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
      ID_EVENT_SOURCE,
      'close'
    )
  }

  f({ url, opt }: I, done: Done<O>, fail: Fail) {
    const {
      api: {
        http: { EventSource },
      },
    } = this.__system

    const eventSource = new EventSource(url, opt)

    this._event_source = eventSource

    eventSource.onerror = (err) => {
      this.d()

      fail('error connecting to server')
    }

    eventSource.onopen = (event) => {
      const emitter = new (class EventEmitter__ extends $ {
        addListener<
          K extends
            | keyof EventEmitter_EE<$_EE>
            | 'destroy'
            | 'register'
            | 'unregister',
        >(event: K, listener: Listener<$Events<$_EE>[K]>): Unlisten {
          super.addListener(event, listener)

          const _listener = (event: MessageEvent) => {
            // @ts-ignore
            listener(event.data)
          }

          eventSource.addEventListener(event, _listener)

          return () => {
            eventSource.removeEventListener(event, _listener)
          }
        }
      })(this.__system)

      // @ts-ignore
      done({ emitter })
    }
  }

  d() {
    if (this._event_source) {
      this._event_source.close()

      this._event_source = null
    }
  }
}
