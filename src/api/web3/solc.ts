let _load_solc_js_promise: Promise<any>

export async function loadSolCJS(): Promise<any> {
  if (!_load_solc_js_promise) {
    _load_solc_js_promise = (async () => {
      const { href } = location
      const SOLCJS_URL = `${href}/3rd/solc-js/soljson-latest.js`
      await import(SOLCJS_URL)
      // @ts-ignores
      return window.Module
    })()
  }

  return _load_solc_js_promise
}
