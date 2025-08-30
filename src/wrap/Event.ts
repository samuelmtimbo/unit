import { $ } from '../Class/$'
import { ReadOnlyError } from '../exception/ObjectReadOnly'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { EV } from '../types/interface/E'
import { V } from '../types/interface/V'

export function wrapEvent(
  event: Event,
  data: any,
  system: System
): EV & V<any> & $ {
  const event_ = new (class Event_ extends $ implements EV, V {
    __: string[] = ['EV']

    read(callback: Callback<any>): void {
      callback(data)
    }

    write(data: any, callback: Callback<undefined>): void {
      throw new ReadOnlyError('event')
    }

    preventDefault(): void {
      event.preventDefault()
    }

    stopPropagation(): void {
      throw new Error('Method not implemented.')
    }
  })(system)

  return event_
}
