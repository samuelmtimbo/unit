import { IBluetoothService } from '../types/global/IBluetoothService'

export interface BS {
  getPrimaryService(name: string): Promise<IBluetoothService>
}
