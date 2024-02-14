import { BluetoothService } from '../global/BluetoothService'

export interface BS {
  getPrimaryService(name: string): Promise<BluetoothService>
}
