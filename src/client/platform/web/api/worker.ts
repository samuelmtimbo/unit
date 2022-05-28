import { API } from '../../../../system'

export function webWorker(window: Window, prefix: string): API['worker'] {
  const worker = {
    start() {
      const { href } = location
      const url = `${href}/_worker.js`
      const worker = new Worker(url)
      return worker
    },
  }

  return worker
}
