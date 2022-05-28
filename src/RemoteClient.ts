import { EXEC, INIT } from './constant/STRING'
import { RemotePort } from './RemotePort'
import { BundleSpec } from './types/BundleSpec'
import { IPort } from './types/global/IPort'

export class RemoteClient {
  private _remote_port: RemotePort

  private _port: IPort

  constructor(port: IPort) {
    this._port = port

    const _port: IPort = {
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

  init(bundle: BundleSpec) {
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
