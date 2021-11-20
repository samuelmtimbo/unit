import { Functional } from '../../../../../Class/Functional'
import { BD } from '../../../../../interface/BD'
import { BS } from '../../../../../interface/BS'
import { BSE } from '../../../../../interface/BSE'
import { ObjectSource } from '../../../../../ObjectSource'

export interface I {
  device: BD
}

export interface O {}

export default class BluetoothServer extends Functional implements BS {
  private _server: any

  private _server_source: ObjectSource<BS> = new ObjectSource()

  constructor() {
    super(
      {
        i: ['device'],
        o: [],
      },
      {
        input: {
          device: {
            ref: true,
          },
        },
      }
    )
  }

  async f({ device }: I): Promise<void> {
    device.getServer((server) => {
      this._server_source.set(server)
    })
  }

  getPrimaryService(uuid: string): Promise<BSE> {
    return this._server.getPrimaryService(uuid)
  }
}
