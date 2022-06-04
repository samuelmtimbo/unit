import { IBluetoothServer } from '../global/IBluetoothServer'

export interface BD {
  getServer(): Promise<IBluetoothServer>
}
