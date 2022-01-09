import { IBluetoothCharacteristic } from './IBluetoothCharacteristic'

export type IBluetoothServiceOpt = {}

export type IBluetoothService = {
  getCharacteristic(uuid: string): Promise<IBluetoothCharacteristic>
}
