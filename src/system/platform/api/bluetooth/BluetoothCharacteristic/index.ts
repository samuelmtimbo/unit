import { $ } from '../../../../../Class/$'
import { Functional, FunctionalEvents } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { BluetoothCharacteristic } from '../../../../../types/global/BluetoothCharacteristic'
import { BC } from '../../../../../types/interface/BC'
import { BSE } from '../../../../../types/interface/BSE'
import { ID_BLUETOOTH_CHARACTERISTIC } from '../../../../_ids'

export interface I {
  service: BSE
  uuid: string
}

export interface O {
  charac: BC
}

type BluetoothCharacteristic_EE = {
  characteristicvaluechanged: [string, boolean]
}

export type BluetoothCharacteristicEvents =
  FunctionalEvents<BluetoothCharacteristic_EE> & BluetoothCharacteristic_EE

export default class BluetoothCharacteristic_ extends Functional<
  I,
  O,
  BluetoothCharacteristicEvents
> {
  private _characteristic: BluetoothCharacteristic

  constructor(system: System) {
    super(
      {
        i: ['service', 'uuid'],
        o: ['charac'],
      },
      {
        input: {
          service: {
            ref: true,
          },
        },
        output: {
          charac: {
            ref: true,
          },
        },
      },
      system,
      ID_BLUETOOTH_CHARACTERISTIC
    )

    this.addListener('listen', ({ event }: { event: string }) => {
      if (event === 'write') {
        void this.startNotifications()
      }
    })
    this.addListener('unlisten', ({ event }: { event: string }) => {
      if (event === 'write') {
        this.stopNotification()
      }
    })
  }

  async f({ service, uuid }, done: Done<O>, fail: Fail): Promise<void> {
    let characteristic: any

    try {
      characteristic = await service.getCharacteristic(uuid)
    } catch (err) {
      fail(err.message.toLowerCase())

      return
    }

    this._characteristic = characteristic

    const charac = new (class _BluetoothDevice extends $ implements BC {
      __ = ['BC']

      read(callback: Callback<any>): void {
        void (async () => {
          const dataView = await characteristic.readValue()

          const data = dataView.getUint8(0).toString()

          callback(data)
        })()
      }

      write(data: any, callback: Callback): void {
        void (async () => {
          try {
            const charCodeArray = data.split('').map((c) => c.charCodeAt(0))

            const buffer = Uint8Array.from(charCodeArray)

            await characteristic.writeValue(buffer)
          } catch (err) {
            callback(err.message)
          }
        })()
      }
    })(this.__system)

    done({ charac })
  }

  d() {
    if (this._characteristic) {
      this.stopNotification()

      this._characteristic = undefined
    }
  }

  private _started: boolean = false

  private async startNotifications() {
    if (this._started) {
      return
    }

    const characteristic = this._characteristic

    this._started = true

    characteristic.startNotifications()

    characteristic.addEventListener('characteristicvaluechanged', (event) => {
      const dataView = event.target.value as DataView
      const { byteLength } = dataView
      let value = ''
      for (let i = 0; i < byteLength; i++) {
        value += String.fromCharCode(dataView.getUint8(i))
      }
      event.stopImmediatePropagation()
      this.emit('characteristicvaluechanged', value, true)
    })
  }

  public stopNotification() {
    if (this._started) {
      return
    }

    this._started = false

    this._characteristic.stopNotifications()
  }
}
