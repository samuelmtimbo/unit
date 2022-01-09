import { IBluetoothServer } from '../types/global/IBluetoothServer'

export interface BD {
  getServer(): Promise<IBluetoothServer>
}
