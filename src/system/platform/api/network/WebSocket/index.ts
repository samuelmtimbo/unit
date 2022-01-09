import {
  Semifunctional,
  SemifunctionalEvents,
} from '../../../../../Class/Semifunctional'
import { CH } from '../../../../../interface/CH'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export type I = {
  url: string
  close: any
}

export type O = {}

export type Websocket_EE = { message: [any] }

export type WebsocketEvents = SemifunctionalEvents<Websocket_EE> & Websocket_EE

export default class Websocket
  extends Semifunctional<I, O, WebsocketEvents>
  implements CH
{
  private _web_socket: WebSocket | null = null

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['url'],
        fo: [],
        i: ['close'],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  f({ url }: I) {
    if (this._web_socket) {
      this._web_socket.close()
    }

    this._web_socket = new WebSocket(url)

    this._web_socket.onopen = () => {
      console.log('WebSocket', 'onopen')
    }
    this._web_socket.onmessage = (message) => {
      console.log('WebSocket', 'onmessage', message)
      this.emit('message', message.data)
    }
    this._web_socket.onerror = (event: Event) => {
      console.log('WebSocket', 'onerror')
      this.err('error') // TODO
    }
    this._web_socket.onclose = (event: CloseEvent) => {
      const { code, reason } = event
      console.log('WebSocket', 'onclose', code, reason)

      this._plunk()
    }
  }

  d() {
    this._plunk()
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'close') {
    this._close()
    // }
  }

  private _plunk = (): void => {
    this._web_socket.onopen = null
    this._web_socket.onmessage = null
    this._web_socket.onerror = null
    this._web_socket.onclose = null

    this._web_socket = null
  }

  private _close(): void {
    if (this._web_socket) {
      if (this._web_socket.readyState === WebSocket.OPEN) {
        this._web_socket.close()
      }
    }
  }

  async send(data: any): Promise<void> {
    if (this._web_socket) {
      if (this._web_socket.readyState === WebSocket.OPEN) {
        this._web_socket.send(data)
      }
    }
  }
}
