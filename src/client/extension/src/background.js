'use strict'

const EXTENSION_ID = 'hcecpkhphpabohdkkpnenodimblpnglc'

chrome.runtime.onConnect.addListener(port => {})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log(message)
  if (sender.id === EXTENSION_ID) {
    const { type, method, data } = message
    chrome[type][method](data, (result) => {
      sendResponse(result)
    })
    return true
  } else {
    return false
  }
})
