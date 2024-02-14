import { BluetoothServer } from './BluetoothServer'

export type BluetoothDeviceOpt = {
  filters?: (
    | { name?: string }
    | { namePrefix?: string }
    | { services: (string | number)[] }
  )[]
  optionalServices?: string[]
  acceptAllDevices?: boolean
}

export type BluetoothDevice = {
  getServer(): Promise<BluetoothServer>
}
