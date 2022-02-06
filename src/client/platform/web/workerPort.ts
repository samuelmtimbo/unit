import { DataEvent } from '../../../events/DataEvent'
import { _ErrorEvent } from '../../../events/ErrorEvent'
import { IPort } from '../../../types/global/IPort'

export const workerPort = (worker: Worker): IPort => {
  const port: IPort = {
    send(message: any): any {
      worker.postMessage(message)
    },
    onmessage(event: DataEvent): any {},
    onerror(event: _ErrorEvent): any {},
    terminate(): any {
      worker.terminate()
    },
  }

  worker.onerror = (event: ErrorEvent) => {
    const { message } = event

    // TODO
    // prevent uncaught exception from propagating to this window
    // event.preventDefault()
    port.onerror({ message })
  }

  worker.onmessage = (event: MessageEvent) => {
    const { data } = event
    port.onmessage({ data })
  }

  return port
}
