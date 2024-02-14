import { DataEvent } from '../../../../events/DataEvent'
import { _ErrorEvent } from '../../../../events/ErrorEvent'
import { Port } from '../../../../types/global/Port'
import { getExtensionElement } from '../../../extension'

export const backgroundPort = (): Port => {
  const extensionElement = getExtensionElement()

  if (!extensionElement) {
    throw new Error('extension element not found')
  }

  const port: Port = {
    send(message: any): any {
      extensionElement.dispatchEvent(
        new CustomEvent('message', { detail: { type: 'send', data: message } })
      )
    },
    onmessage(event: DataEvent): any {},
    onerror(event: _ErrorEvent): any {},
    terminate(): any {
      //
    },
  }

  extensionElement.addEventListener('error', (event: CustomEvent) => {
    const { detail } = event

    port.onerror(detail)
  })

  extensionElement.addEventListener('message', (event: CustomEvent) => {
    const { detail } = event

    if (detail.type === 'send') {
      return
    }

    port.onmessage({ data: detail.data })
  })

  return port
}
