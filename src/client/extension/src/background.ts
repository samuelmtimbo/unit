const EXTENSION_ID = 'hcecpkhphpabohdkkpnenodimblpnglc'

// @ts-ignore
chrome.runtime.onConnect.addListener((port) => {})
// @ts-ignore
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log(message)
  if (sender.id === EXTENSION_ID) {
    const { type, method, data } = message
    // @ts-ignore
    chrome[type][method](data, (result) => {
      sendResponse(result)
    })
    return true
  } else {
    return false
  }
})

export default null
