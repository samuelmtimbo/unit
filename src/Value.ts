import { EventEmitter } from 'events'
import { V } from './interface/V'

export class $Value<T> extends EventEmitter implements V<T> {
  protected _value: T

  constructor(value: T) {
    super()

    this._value = value
  }

  async read(): Promise<any> {
    return this._value
  }

  async write(data: any): Promise<void> {
    this._value
    this.emit('write')
  }
}
