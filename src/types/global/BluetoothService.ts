import { BluetoothCharacteristic } from './BluetoothCharacteristic'

export type BluetoothServiceOpt = {}

export type BluetoothService = {
  getCharacteristic(uuid: string): Promise<BluetoothCharacteristic>
}
