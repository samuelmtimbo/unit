import { DataEvent } from './events/DataEvent'
import { ErrorEvent_ } from './events/ErrorEvent'
import { RemotePort } from './RemotePort'
import { Port } from './types/global/Port'

export class RemoteClient {
  private _remote_port: RemotePort
  private _port: Port

  constructor(port: Port) {
    this._port = port

    const _port: Port = {
      send: (data) => {
        this._port.send(data)
      },
      onmessage(event: DataEvent) {},
      onerror(event: ErrorEvent_) {},
    }

    this._port.onmessage = (data) => {
      _port.onmessage(data)
    }

    this._remote_port = new RemotePort(_port)
  }

  port(): RemotePort {
    return this._remote_port
  }

  invalidate() {
    this._remote_port.close()
  }
}
