import { $ } from '../Class/$'
import { ReadOnlyError } from '../exception/ObjectReadOnly'
import { System } from '../system'
import { EV } from '../types/interface/E'
import { V } from '../types/interface/V'

export function wrapEvent(
  event: Event,
  data: any,
  system: System
): EV & V<any> & $ {
  const event_ = new (class Event_ extends $ implements EV, V {
    __: string[] = ['EV']

    read(): any {
      return data
    }

    write(data: any): void {
      throw new ReadOnlyError('event')
    }

    preventDefault(): void {
      event.preventDefault()
    }

    stopPropagation(): void {
      event.stopPropagation()
    }
  })(system)

  return event_
}
