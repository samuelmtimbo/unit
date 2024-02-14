export type BluetoothDeviceOpt = {}

export type BluetoothCharacteristic = {
  startNotifications(): void
  stopNotifications(): void
  readValue(): Promise<DataView>
  writeValue(buffer: Uint8Array): Promise<void>
  addEventListener(
    event: 'characteristicvaluechanged',
    handler: (event: any) => void
  )
}
