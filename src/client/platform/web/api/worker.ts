import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webWorker(window: Window, opt: BootOpt): API['worker'] {
  const worker = {
    start() {
      const { origin } = window.location

      const url = `${origin}/_worker.js`

      const worker = new Worker(url)

      return worker
    },
  }

  return worker
}
