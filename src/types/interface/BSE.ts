import { BluetoothCharacteristic } from '../global/BluetoothCharacteristic'

export interface BSE {
  getCharacteristic(name: string): Promise<BluetoothCharacteristic>
}
