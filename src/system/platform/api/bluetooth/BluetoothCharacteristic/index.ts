import { $ } from '../../../../../Class/$'
import { Functional, FunctionalEvents } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { BC } from '../../../../../interface/BC'
import { BSE } from '../../../../../interface/BSE'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { IBluetoothCharacteristic } from '../../../../../types/global/IBluetoothCharacteristic'

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

export default class BluetoothCharacteristic extends Functional<
  I,
  O,
  BluetoothCharacteristicEvents
> {
  private _charac: IBluetoothCharacteristic

  constructor(system: System, pod: Pod) {
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
      pod
    )

    this.addListener('listen', ({ event }: { event: string }) => {
      if (event === 'write') {
        this.startNotifications()
      }
    })

    this.addListener('unlisten', ({ event }: { event: string }) => {
      if (event === 'write') {
        this.stopNotification()
      }
    })
  }

  async f({ service, uuid }, done: Done<O>): Promise<void> {
    const _charac = await service.getCharacteristic(uuid)

    this._charac = _charac

    const charac = new (class _BluetoothDevice extends $ implements BC {
      async read(): Promise<any> {
        const dataView = await _charac.readValue()
        return dataView.getUint8(0).toString()
      }

      async write(data: any): Promise<void> {
        const charCodeArray = data.split('').map((c) => c.charCodeAt(0))
        const buffer = Uint8Array.from(charCodeArray)
        await _charac.writeValue(buffer)
        return
      }
    })(this.__system, this.__pod)

    done({ charac })
  }

  d() {}

  private _started: boolean = false

  private async startNotifications() {
    if (this._started) {
      return
    }

    const characteristic = this._charac

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

    this._charac.stopNotifications()
  }
}
