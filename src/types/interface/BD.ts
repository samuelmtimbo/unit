import { BluetoothServer } from '../global/BluetoothServer'

export interface BD {
  getServer(): Promise<BluetoothServer>
}
