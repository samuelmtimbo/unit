import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webHistory(window: Window, opt: BootOpt): API['history'] {
  const location = {
    pushState(data: any, title: string, url: string): void {
      window.history.pushState(data, title, url)
    },
    replaceState(data: any, title: string, url: string): void {
      window.history.replaceState(data, title, url)
    },
  }

  return location
}
