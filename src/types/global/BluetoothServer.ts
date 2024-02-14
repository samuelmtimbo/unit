import { BluetoothService } from './BluetoothService'

export type BluetoothServerOpt = {}

export type BluetoothServer = {
  getPrimaryService(name: string): Promise<BluetoothService>
}
