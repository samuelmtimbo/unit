import { $ } from '../Class/$'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { Unlisten } from '../types/Unlisten'
import { OB } from '../types/interface/OB'

export function wrapIntersectionObserver(
  intersectionObserver: IntersectionObserver,
  system: System
): OB & $ {
  const observer = new (class IntersectionObserver_ extends $ implements OB {
    __: string[] = ['OB']

    observe(element: Element, callback: Callback): Unlisten {
      intersectionObserver.observe(element)

      return () => {
        intersectionObserver.unobserve(element)
      }
    }
  })(system)

  return observer
}
