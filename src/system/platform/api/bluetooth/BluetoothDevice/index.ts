import { Callback } from '../../../../../Callback'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { BD } from '../../../../../interface/BD'
import { ObjectSource } from '../../../../../ObjectSource'

export interface I {
  opt: {
    filters?: (
      | { name?: string }
      | { namePrefix?: string }
      | { services: (string | number)[] }
    )[]
    optionalServices?: string[]
    acceptAllDevices?: boolean
  }
}

export interface O {}

export default class BluetoothDevice extends Functional<I, O> implements BD {
  private _device_source: ObjectSource<any> = new ObjectSource()

  constructor(config?: Config) {
    super(
      {
        i: ['opt'],
        o: [],
      },
      config
    )
  }

  f({ opt }: I, done: Done<O>) {
    // @ts-ignore
    if (navigator.bluetooth) {
      // show Bluetooth select system UI on next tick to prevent
      // possible interference with triggering event propagation
      setTimeout(() => {
        // @ts-ignore
        navigator.bluetooth
          .requestDevice(opt)
          .then((device: any) => {
            // TODO
            this._device_source.set(device)
          })
          .catch((err) => {
            const message = err.message
            if (message === 'User cancelled the requestDevice() chooser.') {
              done(undefined, 'user cancelled chooser')
            } else if (
              message ===
              "Failed to execute 'requestDevice' on 'Bluetooth': Either 'filters' should be present or 'acceptAllDevices' should be true, but not both."
            ) {
              done(
                undefined,
                `either 'filters' should be present or 'acceptAllDevices' should be true, but not both.`
              )
            } else {
              done(undefined, err.message)
            }
          })
      }, 0)
    } else {
      done(undefined, 'Bluetooth API not supported')
    }
  }

  getServer(callback: Callback<any>): void {
    this._device_source.connect(async (device) => {
      const { gatt } = device
      if (gatt) {
        try {
          const server = await device.gatt.connect()
          callback(server)
        } catch (err) {
          this.err(err.message)
        }
      } else {
        this.err('cannot find device remote GATT server')
      }
    })
  }
}
