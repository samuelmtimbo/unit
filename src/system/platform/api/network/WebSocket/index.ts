import { Callback } from '../../../../../Callback'
import { Config } from '../../../../../Class/Unit/Config'
import { Primitive } from '../../../../../Primitive'

export type I = {
  url: string
  close: any
}

export type O = {}

export default class Websocket extends Primitive<I, O> {
  private _webSocket: WebSocket | null = null

  constructor(config?: Config) {
    super(
      {
        i: ['url', 'close'],
        o: [],
      },
      config
    )
  }

  onDataInputData(name: string, data: any) {
    if (name === 'url') {
      const url = data

      if (this._webSocket) {
        this._webSocket.close()
      }

      if (url !== undefined) {
        this._webSocket = new WebSocket(url)
        this._webSocket.onopen = () => {
          console.log('WebSocket', 'onopen')
        }
        this._webSocket.onmessage = (message) => {
          console.log('WebSocket', 'onmessage', message)
          this.emit('message', message.data)
        }
        this._webSocket.onerror = (event: Event) => {
          console.log('WebSocket', 'onerror')
          this.err('error') // TODO
        }
      }
    }
  }

  $send({ message }: { message: string }, callback: Callback) {
    if (this._webSocket) {
      this._webSocket.send(message)
      callback()
    }
  }

  close({}: {}, callback: Callback) {
    if (this._webSocket) {
      this._webSocket.close()
      callback()
    }
  }
}
