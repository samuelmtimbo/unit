const div = document.createElement('div')
div.style.display = 'none'
div.id = '__EXTENSION_INSTALLED'
document.body.appendChild(div)

// @ts-ignore
const port = chrome.runtime.connect({ name: 'knockknock' })

window.addEventListener(
  'message',
  function (event) {
    // only accept messages from this window
    if (event.source !== window) {
      return
    }

    const { data } = event

    const { type, id, data: _data } = data

    if (type && type === 'EXTENSION_IN' && id) {
      const { type: _type, data: __data } = _data
      switch (_type) {
        case 'CALL':
          // @ts-ignore
          chrome.runtime.sendMessage(__data, (data) => {
            // @ts-ignore
            if (chrome.runtime.lastError) {
              // @ts-ignore
              console.log(chrome.runtime.lastError.message)
            } else {
              window.postMessage({ type: 'EXTENSION_OUT', id, data })
            }
          })
          break
        case 'PING':
          window.postMessage({ type: 'EXTENSION_OUT', id, data: true })
          break
        default:
          throw new Error('not supported')
      }
    }
  },
  false
)

export default null