import { Callback } from '../../../../../Callback'
import { Config } from '../../../../../Class/Unit/Config'
import { ObjectSource } from '../../../../../ObjectSource'
import { Primitive } from '../../../../../Primitive'

export interface I {
  opt: any
}

export interface O {}

export default class BluetoothDevice extends Primitive<I, O> {
  private _device_source: ObjectSource<any> = new ObjectSource()

  constructor(config?: Config) {
    super(
      {
        i: ['opt'],
        o: [],
      },
      config
    )

    this.addListener('take_err', () => {
      // TODO
    })
  }

  getServer(callback: Callback<any>): void {
    this._device_source.connect(async (device) => {
      const { gatt } = device
      if (gatt) {
        try {
          const server = await device.connect()
          callback(server)
        } catch (err) {
          this.err(err.message)
        }
      } else {
        this.err('cannot find device remote GATT server')
      }
    })
  }

  onDataInputData(name: string, data: any) {
    // if (name === 'opt') {
    if (this.hasErr()) {
      this.takeErr()
    }

    const opt = this._input.opt.peak()

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
              this.err('user cancelled chooser')
            } else if (
              message ===
              "Failed to execute 'requestDevice' on 'Bluetooth': Either 'filters' should be present or 'acceptAllDevices' should be true, but not both."
            ) {
              this.err(
                `either 'filters' should be present or 'acceptAllDevices' should be true, but not both.`
              )
            } else {
              this.err(err.message)
            }
          })
      }, 0)
    } else {
      this.err('Bluetooth API not supported')
    }
  }

  onDataInputDrop(name: string): void {
    // if (name === 'opt') {
    this._device_source.set(null)

    if (this.hasErr()) {
      this.takeErr()
    }
    // }
  }
}
