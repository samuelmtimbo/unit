import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webWorker(window: Window, opt: BootOpt): API['worker'] {
  const worker = {
    start() {
      const { href } = location
      const url = `${href}_worker.js`
      const worker = new Worker(url)
      return worker
    },
  }

  return worker
}
