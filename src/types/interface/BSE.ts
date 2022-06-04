import { IBluetoothCharacteristic } from '../global/IBluetoothCharacteristic'

export interface BSE {
  getCharacteristic(name: string): Promise<IBluetoothCharacteristic>
}
