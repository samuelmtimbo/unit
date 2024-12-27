import { $ } from '../Class/$'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { V } from '../types/interface/V'

export function wrapValue(data: any, system: System): V<number> {
  return new (class Value extends $ implements V<number> {
    __: string[] = ['V']

    read(callback: Callback<number>): void {
      callback(data)
    }

    write(data: number, callback: Callback): void {
      callback(undefined, 'value is read only')
    }
  })(system)
}
