import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { BD } from '../../../../../interface/BD'
import { BS } from '../../../../../interface/BS'
import { BSE } from '../../../../../interface/BSE'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { IBluetoothService } from '../../../../../types/global/IBluetoothService'

export interface I {
  device: BD
}

export interface O {
  server: BS
}

export default class BluetoothServer extends Functional implements BS {
  private _server: any

  constructor(system: System, pod: Pod) {
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
      pod
    )
  }

  async f({ device }: I, done: Done<O>): Promise<void> {
    const _server = await device.getServer()

    const server = new (class _BluetoothDevice extends $ implements BS {
      getPrimaryService(name: string): Promise<IBluetoothService> {
        return _server.getPrimaryService(name)
      }
    })(this.__system, this.__pod)

    done({ server })
  }

  getPrimaryService(uuid: string): Promise<BSE> {
    return this._server.getPrimaryService(uuid)
  }
}
