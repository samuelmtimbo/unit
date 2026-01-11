import { DataEvent } from '../../../../events/DataEvent'
import { ErrorEvent_ } from '../../../../events/ErrorEvent'
import { Port } from '../../../../types/global/Port'

export const workerPort = (worker: Worker): Port => {
  const port: Port = {
    send(message: any): any {
      worker.postMessage(message)
    },
    onmessage(event: DataEvent): any {},
    onerror(event: ErrorEvent_): any {},
  }

  worker.onerror = (event: ErrorEvent) => {
    const { message } = event

    port.onerror({ message })
  }

  worker.onmessage = (event: MessageEvent) => {
    const { data } = event

    port.onmessage(data)
  }

  return port
}
