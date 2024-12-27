import { SharedRef } from '../SharefRef'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { V } from '../types/interface/V'

export function wrapSharedValue<T>(data: SharedRef<T>, _system: System): V {
  return {
    read(callback: Callback<T>): void {
      callback(data.current)
    },

    write(data_: any, callback: Callback): void {
      data.current = data_

      callback()
    },
  }
}
