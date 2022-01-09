import { IBluetoothService } from './IBluetoothService'

export type IBluetoothServerOpt = {}

export type IBluetoothServer = {
  getPrimaryService(name: string): Promise<IBluetoothService>
}
