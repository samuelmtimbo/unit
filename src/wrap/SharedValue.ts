import { SharedRef } from '../SharefRef'
import { System } from '../system'
import { V } from '../types/interface/V'

export function wrapSharedValue<T>(data: SharedRef<T>, _system: System): V {
  return {
    async read(): Promise<T> {
      return data.current
    },

    async write(data_: any): Promise<void> {
      data.current = data_
    },
  }
}
