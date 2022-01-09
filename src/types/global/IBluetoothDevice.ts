import { IBluetoothServer } from './IBluetoothServer'

export type IBluetoothDeviceOpt = {
  filters?: (
    | { name?: string }
    | { namePrefix?: string }
    | { services: (string | number)[] }
  )[]
  optionalServices?: string[]
  acceptAllDevices?: boolean
}

export type IBluetoothDevice = {
  getServer(): Promise<IBluetoothServer>
}
