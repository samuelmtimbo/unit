chrome.runtime.onConnect.addListener((port) => {
  //
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, method, data } = message

  chrome[type][method](data, (result) => {
    sendResponse(result)
  })

  return true
})

export default null
