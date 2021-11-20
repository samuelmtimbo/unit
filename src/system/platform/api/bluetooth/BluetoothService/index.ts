import { Callback } from '../../../../../Callback'
import { Functional } from '../../../../../Class/Functional'
import { BS } from '../../../../../interface/BS'
import { BSE } from '../../../../../interface/BSE'
import { ObjectSource } from '../../../../../ObjectSource'

export interface I {
  server: BS
  uuid: string
}

export interface O {}

export default class BluetoothService extends Functional<I, O> implements BSE {
  private _service_source: ObjectSource<BSE> = new ObjectSource()

  constructor() {
    super(
      {
        i: ['server', 'uuid'],
        o: [],
      },
      {
        input: {
          server: {
            ref: true,
          },
        },
      }
    )
  }

  async f({ server, uuid }: I): Promise<void> {
    server.getPrimaryService(uuid, (service) => {
      this._service_source.set(service)
    })
  }

  d() {
    this._service_source.set(null)
  }

  getCharacteristic(uuid: string, callback: Callback<any>): void {
    this._service_source.connect(async (service) => {
      service.getCharacteristic(uuid, (characteristic) => {
        callback(characteristic)
      })
    })
  }
}
