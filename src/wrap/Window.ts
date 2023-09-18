import { $ } from '../Class/$'
import { System } from '../system'
import { Listener } from '../types/Listener'
import { Unlisten } from '../types/Unlisten'
import { W } from '../types/interface/W'
import { wrapValue } from './Value'

export function wrapWindow(window: Window, system: System): W {
  return new (class Window_ extends $<any> implements W {
    __: string[] = ['W']

    window(): Window {
      return window
    }

    async send(data: any): Promise<void> {
      window.postMessage(data, '*')
    }

    postMessage(data: any, target: string): void {
      window.postMessage(data, target)
    }

    addListener<K extends string>(event: K, listener: Listener<any>): Unlisten {
      const _listener = (event: MessageEvent) => {
        if (event.source === window) {
          const data = wrapValue(event.data, system)

          listener(data)
        }
      }

      window.addEventListener(event, _listener)

      return () => {
        window.removeEventListener(event, _listener)
      }
    }
  })(system)
}
