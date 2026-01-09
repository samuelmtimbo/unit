import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { intercept } from '../../../../../client/platform/web/api/intercept'
import { apiNotSupportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
import { EE } from '../../../../../types/interface/EE'
import { uuidNotIn } from '../../../../../util/id'
import { ID_EVENT_SOURCE } from '../../../../_ids'

export type I = {
  url: string
  opt: EventSourceInit
  close: any
}

export type O = {
  emitter: $ & EE
}

export interface EventSourceShape {
  readyState: number
  onopen(evevnt: Event): void
  onmessage(event: MessageEvent): void
  onerror(event: Event): void
  close(): void
}

export const CUSTOM_HEADER_X_EVENT_SOURCE_ID = 'X-EventSource-Id'

export default class EventSource_ extends Holder<I, O> {
  private _eventSource: EventSourceShape = null

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

  async f({ url, opt }: I, done: Done<O>, fail: Fail) {
    const {
      api: {
        http: { EventSource, fetch },
        window: { nextTick },
      },
      cache: { interceptors, eventSources },
    } = this.__system

    if (!EventSource) {
      fail(apiNotSupportedError('EventSource'))

      return
    }

    const emitter = new (class EventEmitter__ extends $<any> {})(this.__system)

    const willIntercept = interceptors.some((interceptor) =>
      intercept(interceptor.opt, url)
    )

    if (willIntercept) {
      const internalId = uuidNotIn(eventSources)

      const upgrade = async () => {
        return await fetch(
          url,
          {
            method: 'GET',
            headers: {
              Accept: 'text/event-stream',
              [CUSTOM_HEADER_X_EVENT_SOURCE_ID]: internalId,
            },
          },
          interceptors
        )
      }

      const eventSource: EventSourceShape = {
        readyState: EventSource.CONNECTING,
        onopen: function (): void {
          emitter.emit('open', {})
        },
        onmessage: function (event: MessageEvent): void {
          const { data } = event

          emitter.emit('message', data)
        },
        onerror: function (event: Event): void {
          if (eventSource.readyState === EventSource.CLOSED) {
            emitter.emit('error', {})
          }
        },
        close: function (): void {
          //
        },
      }

      this._eventSource = eventSource

      eventSources[internalId] = this._eventSource

      let response: Response

      try {
        response = await upgrade()
      } catch (err) {
        fail('could not connect')

        return
      }

      const redirectStatusCodes = [301, 302, 303, 307, 308]

      if (redirectStatusCodes.includes(response.status)) {
        nextTick(() => {
          eventSource.readyState = EventSource.CLOSED

          eventSource.onerror(new Event('error'))
        })

        return
      }

      if (response.ok) {
        if (response.headers['Content-Type'] === 'text/event-stream') {
          nextTick(() => {
            eventSource.readyState = EventSource.OPEN

            eventSource.onopen(new Event('open'))
          })
        } else {
          nextTick(() => {
            eventSource.readyState = EventSource.CLOSED

            eventSource.onerror(new Event('error'))
          })
        }
      } else {
        nextTick(() => {
          eventSource.readyState = EventSource.CLOSED

          eventSource.onerror(new Event('error'))
        })

        return
      }
    } else {
      try {
        const eventSource = new EventSource(url, opt)

        this._eventSource = eventSource

        this._eventSource.onopen = () => {
          emitter.emit('open', {})
        }

        this._eventSource.onmessage = (event: MessageEvent) => {
          const { data } = event

          emitter.emit('message', data)
        }

        this._eventSource.onerror = (event) => {
          if (eventSource.readyState === EventSource.CONNECTING) {
            emitter.emit('error', 'disconnected')

            return
          }

          emitter.emit('error', '')
        }
      } catch (err) {
        fail(err.message.toLowerCase())

        return
      }
    }

    done({ emitter })
  }

  d() {
    if (this._eventSource) {
      this._eventSource.close()

      this._eventSource = null
    }
  }
}
