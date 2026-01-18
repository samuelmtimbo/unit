import { SharedRef } from '../SharefRef'
import { System } from '../system'
import { V } from '../types/interface/V'

export function wrapSharedValue<T>(data: SharedRef<T>, _system: System): V {
  return {
    read(): T {
      return data.current
    },

    write(data_: any): void {
      data.current = data_
    },
  }
}
