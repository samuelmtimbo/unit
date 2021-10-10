import { Callback } from '../../../../../Callback'
import { Config } from '../../../../../Class/Unit/Config'
import { ObjectSource } from '../../../../../ObjectSource'
import { Primitive } from '../../../../../Primitive'
import BluetoothDevice from '../BluetoothDevice'

export interface I {
  device: BluetoothDevice
}

export interface O {}

export default class BluetoothServer extends Primitive<I, O> {
  private _server: any

  private _server_source: ObjectSource<any> = new ObjectSource()

  constructor(config?: Config) {
    super(
      {
        i: ['device'],
        o: [],
      },
      config,
      {
        input: {
          device: {
            ref: true,
          },
        },
      }
    )
  }

  onRefInputData(name: string, data: any): void {
    const device = data as BluetoothDevice
    device.getServer((server) => {
      this._server_source.set(server)
    })
  }

  onRefInputDrop(name: string): void {}

  getPrimaryService(uuid: string, callback: Callback<any>): void {
    this._server.getPrimaryService(uuid)
  }
}
