import { Callback } from '../../../../../Callback'
import { Config } from '../../../../../Class/Unit/Config'
import { CH } from '../../../../../interface/CH'
import { Primitive } from '../../../../../Primitive'

export type I = {
  url: string
  close: any
}

export type O = {}

export default class Websocket extends Primitive<I, O> implements CH {
  private _web_socket: WebSocket | null = null

  constructor(config?: Config) {
    super(
      {
        i: ['url', 'close'],
        o: [],
      },
      config
    )

    this.addListener('take_err', () => {
      this._backward_all()
    })

    this.addListener('take_caught_err', () => {
      this._backward_all()
    })
  }

  onDataInputData(name: string, data: any) {
    if (name === 'url') {
      const url = data

      if (this.hasErr()) {
        this.takeErr()
      }

      if (this._web_socket) {
        this._web_socket.close()
      }

      if (url !== undefined) {
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

          // this._backward('url')
        }
      }
    }
  }

  private _plunk = (): void => {
    this._web_socket.onopen = null
    this._web_socket.onmessage = null
    this._web_socket.onerror = null
    this._web_socket.onclose = null

    this._web_socket = null
  }

  close({}: {}, callback: Callback): void {
    if (this._web_socket) {
      if (this._web_socket.readyState === WebSocket.OPEN) {
        this._web_socket.close()
        callback()
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
