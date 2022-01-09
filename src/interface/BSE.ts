import { IBluetoothCharacteristic } from '../types/global/IBluetoothCharacteristic'

export interface BSE {
  getCharacteristic(name: string): Promise<IBluetoothCharacteristic>
}
