import { EXEC, INIT } from './constant/STRING'
import { Port } from './Port'
import { RemotePort } from './RemotePort'
import { Bundle } from './system/platform/method/process/WorkerPod'

export class RemoteClient {
  private _remote_port: RemotePort

  private _port: Port

  constructor(port: Port) {
    this._port = port

    const _port: Port = {
      send: (data) => {
        const _data = this._exec_data(data)
        this._port.send(_data)
      },
      onmessage(data: any) {},
      onerror() {},
      terminate() {},
    }

    this._port.onmessage = (data) => {
      _port.onmessage(data)
    }

    this._remote_port = new RemotePort(_port)
  }

  private _init_data = (data: any): { type: string; data: any } => {
    return { type: INIT, data }
  }

  private _exec_data = (data: any): { type: string; data: any } => {
    return { type: EXEC, data }
  }

  init(bundle: Bundle) {
    const _data = this._init_data(bundle)
    this._port.send(_data)
  }

  terminate() {
    this._port.terminate()
  }

  port(): RemotePort {
    return this._remote_port
  }

  invalidate() {
    this._remote_port.close()
  }
}
