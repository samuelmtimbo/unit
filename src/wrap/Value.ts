import { $ } from '../Class/$'
import { ReadOnlyError } from '../exception/ObjectReadOnly'
import { System } from '../system'
import { V } from '../types/interface/V'

export function wrapValue(data: any, system: System): V<number> {
  return new (class Value extends $ implements V<number> {
    __: string[] = ['V']

    read(): Promise<number> {
      return data
    }

    write(data: number): Promise<void> {
      throw new ReadOnlyError('value')
    }
  })(system)
}
