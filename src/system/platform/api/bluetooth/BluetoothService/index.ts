import { Callback } from '../../../../../Callback'
import { Config } from '../../../../../Class/Unit/Config'
import { ObjectSource } from '../../../../../ObjectSource'
import { Primitive } from '../../../../../Primitive'
import BluetoothServer from '../BluetoothServer'

export interface I {
  server: BluetoothServer
  uuid: string
}

export interface O {}

export default class BluetoothService extends Primitive<I, O> {
  private _service_source: ObjectSource<any> = new ObjectSource()

  constructor(config?: Config) {
    super(
      {
        i: ['server', 'uuid'],
        o: [],
      },
      config,
      {
        input: {
          server: {
            ref: true,
          },
        },
      }
    )
  }

  getCharacteristic(uuid: string, callback: Callback<any>): void {
    this._service_source.connect(async (service) => {
      const characteristic = await service.getCharacteristic(uuid)
      callback(characteristic)
    })
  }

  onRefInputData(name: string, data: any): void {
    // if (name === 'server') {
    this._setup()
    // }
  }

  onRefInputDrop(name: string): void {
    this._plunk()
  }

  private _setup = () => {
    const { uuid, server } = this._i

    if (uuid && server) {
      server.getPrimaryService(uuid, (service) => {
        this._service_source.set(service)
      })
    }
  }

  private _plunk = () => {
    this._service_source.set(null)
  }
}
