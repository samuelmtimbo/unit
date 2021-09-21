let _load_solc_js_promise: Promise<any>

// @ts-ignore
window = globalThis

export async function loadSolCJS(): Promise<any> {
  if (!_load_solc_js_promise) {
    _load_solc_js_promise = (async () => {
      const { href } = location
      const _href = href.replace('/_worker-solc.js', '')
      const SOLCJS_URL = `${_href}/3rd/solc-js/soljson-latest.js`
      await import(SOLCJS_URL)
      return globalThis.solc
    })()
  }

  return _load_solc_js_promise
}

loadSolCJS()

onmessage = async (event) => {
  const { data } = event

  const { callId, content } = data

  const solc = await loadSolCJS()

  const input = {
    language: 'Solidity',
    sources: {
      'test.sol': {
        // content: 'pragma solidity ^0.8.7; contract C { function f() public { } }',
        content,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  }

  try {
    const result = {}

    const json = JSON.stringify(input)

    const compiled_json = solc.compile(json)

    const output = JSON.parse(compiled_json)

    const { errors = [] } = output

    const _errors = errors.filter((e) => e.severity === 'error')

    if (_errors.length > 0 || !output.contracts) {
      const first_error = _errors[0]
      const message =
        (first_error && first_error.message) || 'could not compile'
      throw new Error(message)
    }

    const test_contract = output.contracts['test.sol']
    for (var contractName in test_contract) {
      result[contractName] = test_contract[contractName].evm.bytecode.object
    }

    postMessage({ callId, result, err: null }, null, [])
  } catch (err) {
    postMessage({ callId, result: null, err: err.message }, null, [])
  }
}
