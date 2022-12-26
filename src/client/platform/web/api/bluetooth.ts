import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { sleep } from '../../../../sleep'
import { API, BootOpt } from '../../../../system'
import { IBluetoothDeviceOpt } from '../../../../types/global/IBluetoothDevice'
import { IBluetoothServer } from '../../../../types/global/IBluetoothServer'

export function webBluetooth(window: Window, opt: BootOpt): API['bluetooth'] {
  const { navigator } = window

  const bluetooth = {
    requestDevice: async (opt: IBluetoothDeviceOpt) => {
      // @ts-ignore
      if (navigator.bluetooth) {
        // show system UI on next tick to prevent possible
        // interference with triggering event propagation
        await sleep()

        try {
          // @ts-ignore
          const device = await navigator.bluetooth.requestDevice(opt)

          return {
            getServer: async () => {
              const { gatt } = device
              if (gatt) {
                try {
                  return (await device.gatt.connect()) as IBluetoothServer
                } catch (err) {
                  throw new Error(err.message)
                }
              } else {
                throw new Error(
                  'cannot find bluetooth device remote GATT server'
                )
              }
            },
          }
        } catch (err) {
          const { message } = err
          if (message === 'User cancelled the requestDevice() chooser.') {
            throw new Error('user cancelled chooser')
          } else if (
            message ===
            "Failed to execute 'requestDevice' on 'Bluetooth': Either 'filters' should be present or 'acceptAllDevices' should be true, but not both."
          ) {
            throw new Error(
              `either 'filters' should be present or 'acceptAllDevices' should be true, but not both.`
            )
          } else {
            throw err
          }
        }
      } else {
        throw new APINotSupportedError('Bluetooth')
      }
    },
  }

  return bluetooth
}
