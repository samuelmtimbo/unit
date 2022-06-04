import { $ } from '../Class/$'
import { Pod } from '../pod'
import { System } from '../system'
import { V } from '../types/interface/V'

export function wrapValue<T>(data: T, _system: System, _pod: Pod): $ & V {
  return new (class Pod extends $ implements V<T> {
    private _data: T = data

    async read(): Promise<T> {
      return this._data
    }

    async write(data: any): Promise<void> {
      this._data = data
    }
  })(_system, _pod)
}
