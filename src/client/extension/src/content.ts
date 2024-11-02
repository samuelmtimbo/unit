import { SYSTEM_EXTENSION_ID, dispatchExtensionEvent } from '..'
import { CALL } from '../../../constant/STRING'
import { Action } from '../../../types/Action'

const element = document.createElement('div')

element.style.display = 'none'

element.id = SYSTEM_EXTENSION_ID

document.body.appendChild(element)

type ExtensionAction = Action & { id?: string }

element.addEventListener(
  'message',
  function (event: CustomEvent<ExtensionAction>) {
    const { detail } = event

    const { type, id, data } = detail

    if (type === 'send') {
      const { type: _type, data: _data } = data

      switch (_type) {
        case CALL:
          chrome.runtime.sendMessage(_data, (data) => {
            if (chrome.runtime.lastError) {
              const err = chrome.runtime.lastError.message.toLowerCase()

              dispatchExtensionEvent('callback', id, { err })
            } else {
              dispatchExtensionEvent('callback', id, data)
            }
          })

          break
        default:
          dispatchExtensionEvent('callback', id, { err: 'not supported' })
      }
    } else {
      // ignore "callback"
    }
  },
  false
)
