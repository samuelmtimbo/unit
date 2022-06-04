import { IBluetoothService } from '../global/IBluetoothService'

export interface BS {
  getPrimaryService(name: string): Promise<IBluetoothService>
}
