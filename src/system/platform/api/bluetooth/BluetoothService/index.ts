import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { IBluetoothCharacteristic } from '../../../../../types/global/IBluetoothCharacteristic'
import { BS } from '../../../../../types/interface/BS'
import { BSE } from '../../../../../types/interface/BSE'
import { ID_BLUETOOTH_SERVICE } from '../../../../_ids'

export interface I {
  server: BS
  uuid: string
}

export interface O {
  service: BSE
}

export default class BluetoothService extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['server', 'uuid'],
        o: ['service'],
      },
      {
        input: {
          server: {
            ref: true,
          },
        },
        output: {
          service: {
            ref: true,
          },
        },
      },
      system,
      ID_BLUETOOTH_SERVICE
    )
  }

  async f({ server, uuid }: I, done: Done<O>): Promise<void> {
    const _service = await server.getPrimaryService(uuid)

    const service = new (class _BluetoothDevice extends $ implements BSE {
      getCharacteristic(name: string): Promise<IBluetoothCharacteristic> {
        return _service.getCharacteristic(name)
      }
    })(this.__system)

    done({ service })
  }

  d() {}
}
