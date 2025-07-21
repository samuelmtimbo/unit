import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { BluetoothDeviceOpt } from '../../../../../types/global/BluetoothDevice'
import { BluetoothServer } from '../../../../../types/global/BluetoothServer'
import { BD } from '../../../../../types/interface/BD'
import { ID_BLUETOOTH_DEVICE } from '../../../../_ids'

export interface I {
  opt: BluetoothDeviceOpt
}

export interface O {
  device: BD
}

export default class BluetoothDevice extends Functional<I, O> {
  constructor(system: System) {
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
      ID_BLUETOOTH_DEVICE
    )
  }

  async f({ opt }: I, done: Done<O>, fail: Fail) {
    const {
      api: {
        bluetooth: { requestDevice },
      },
    } = this.__system

    let device: any

    try {
      const _device = await requestDevice(opt)

      device = new (class _BluetoothDevice extends $ implements BD {
        async getServer(): Promise<BluetoothServer> {
          return _device.getServer()
        }
      })(this.__system)
    } catch (err) {
      fail(err.message)

      return
    }

    done({ device })
  }

  d() {}
}
