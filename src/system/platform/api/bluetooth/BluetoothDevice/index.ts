import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { BD } from '../../../../../types/interface/BD'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { IBluetoothDeviceOpt } from '../../../../../types/global/IBluetoothDevice'
import { IBluetoothServer } from '../../../../../types/global/IBluetoothServer'

export interface I {
  opt: IBluetoothDeviceOpt
}

export interface O {
  device: BD
}

export default class BluetoothDevice extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['opt'],
        o: ['device'],
      },
      {
        output: {
          device: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  async f({ opt }: I, done: Done<O>) {
    const {
      api: {
        bluetooth: { requestDevice },
      },
    } = this.__system
    try {
      const _device = await requestDevice(opt)

      const device = new (class _BluetoothDevice extends $ implements BD {
        async getServer(): Promise<IBluetoothServer> {
          return _device.getServer()
        }
      })(this.__system, this.__pod)

      done({ device })
    } catch (err) {
      done(undefined, err.message)
    }
  }
}
