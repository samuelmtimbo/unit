import { Config } from '../../../../../Class/Unit/Config'
import { V } from '../../../../../interface/V'
import { ObjectWaiter } from '../../../../../ObjectWaiter'
import { Primitive } from '../../../../../Primitive'
import BluetoothService from '../BluetoothService'

export interface I {
  service: BluetoothService
  uuid: string
}

export interface O {}

export default class BluetoothCharacteristic
  extends Primitive<I, O>
  implements V<string>
{
  private _characteristic: any

  private _characteristic_waiter = new ObjectWaiter<any>()

  constructor(config?: Config) {
    super(
      {
        i: ['service', 'uuid'],
        o: [],
      },
      config,
      {
        input: {
          service: {
            ref: true,
          },
        },
      }
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

  onRefInputData(name: string, data: any): void {
    // if (name === 'service') {
    if (this._input.service.active() && this._input.uuid.active()) {
      this._setup()
    }
    this._setup()
    // }
  }

  onRefInputDrop(name: string): void {
    // if (name === 'service') {
    this._characteristic_waiter.set(null)
    // }
  }

  private _setup() {
    const { service, uuid } = this._i

    service.getCharacteristic(uuid, (characteristic) => {
      this._characteristic_waiter.set(characteristic)
    })
  }

  private _started: boolean = false

  public async startNotifications() {
    if (this._started) {
      return
    }

    const characteristic = await this._characteristic_waiter.once()

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

  public async write(data: string): Promise<void> {
    if (this._characteristic) {
      const charCodeArray = data.split('').map((c) => c.charCodeAt(0))
      const buffer = Uint8Array.from(charCodeArray)
      await this._characteristic.writeValue(buffer)
      return
    }
  }

  public async read(): Promise<string> {
    if (this._characteristic) {
      const dataView = await this._characteristic.readValue()
      return dataView.getUint8(0).toString()
    }
  }
}
