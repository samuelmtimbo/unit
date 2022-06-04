import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { BS } from '../../../../../types/interface/BS'
import { BSE } from '../../../../../types/interface/BSE'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { IBluetoothCharacteristic } from '../../../../../types/global/IBluetoothCharacteristic'

export interface I {
  server: BS
  uuid: string
}

export interface O {
  service: BSE
}

export default class BluetoothService extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
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
      pod
    )
  }

  async f({ server, uuid }: I, done: Done<O>): Promise<void> {
    const _service = await server.getPrimaryService(uuid)

    const service = new (class _BluetoothDevice extends $ implements BSE {
      getCharacteristic(name: string): Promise<IBluetoothCharacteristic> {
        return _service.getCharacteristic(name)
      }
    })(this.__system, this.__pod)

    done({ service })
  }

  d() {}
}
