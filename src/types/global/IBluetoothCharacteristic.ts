export type IBluetoothDeviceOpt = {}

export type IBluetoothCharacteristic = {
  startNotifications(): void
  stopNotifications(): void
  readValue(): Promise<DataView>
  writeValue(buffer: Uint8Array): Promise<void>
  addEventListener(
    event: 'characteristicvaluechanged',
    handler: (event: any) => void
  )
}
