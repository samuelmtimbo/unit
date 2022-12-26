import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { IBluetoothService } from '../../../../../types/global/IBluetoothService'
import { BD } from '../../../../../types/interface/BD'
import { BS } from '../../../../../types/interface/BS'
import { BSE } from '../../../../../types/interface/BSE'
import { ID_BLUETOOTH_SERVER } from '../../../../_ids'

export interface I {
  device: BD
}

export interface O {
  server: BS
}

export default class BluetoothServer extends Functional implements BS {
  private _server: any

  constructor(system: System) {
    super(
      {
        i: ['device'],
        o: ['server'],
      },
      {
        input: {
          device: {
            ref: true,
          },
        },
        output: {
          server: {
            ref: true,
          },
        },
      },
      system,
      ID_BLUETOOTH_SERVER
    )
  }

  async f({ device }: I, done: Done<O>): Promise<void> {
    const _server = await device.getServer()

    const server = new (class _BluetoothDevice extends $ implements BS {
      getPrimaryService(name: string): Promise<IBluetoothService> {
        return _server.getPrimaryService(name)
      }
    })(this.__system)

    done({ server })
  }

  getPrimaryService(uuid: string): Promise<BSE> {
    return this._server.getPrimaryService(uuid)
  }
}
