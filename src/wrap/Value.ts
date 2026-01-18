import { $ } from '../Class/$'
import { System } from '../system'
import { V } from '../types/interface/V'

export function wrapValue(data: any, system: System): V<number> {
  return new (class Value extends $ implements V<number> {
    __: string[] = ['V']

    read(): any {
      return data
    }

    write(data: number): void {
      throw new Error('value is read only')
    }
  })(system)
}
