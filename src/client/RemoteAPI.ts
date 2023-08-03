import { DataEvent } from '../events/DataEvent'
import { _ErrorEvent } from '../events/ErrorEvent'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { Callback } from '../types/Callback'
import { Dict } from '../types/Dict'
import { IPort } from '../types/global/IPort'
import { Unlisten } from '../types/Unlisten'

type RemoteAPICall = (data: any, callback: Callback<any>) => void
type RemoteAPIWatch = (data: any, callback: Callback<any>) => Unlisten

export interface RemoteAPI {
  call: Dict<RemoteAPICall>
  watch: Dict<RemoteAPIWatch>
  ref: Dict<(data: any) => RemoteAPI>
}

export type RemoteAPIData = {
  type: 'call' | 'watch' | 'unwatch' | 'ref' | 'ref_exec'
  data: any
}

const remoteApi: RemoteAPI = {
  call: {},
  watch: {},
  ref: {
    createA: (data: {}): RemoteAPI => {
      return {
        call: {},
        watch: {},
        ref: {},
      }
    },
  },
}

// remote process down here

class A {
  increment(n: number): number {
    return n + 1
  }
  watchBodyClick(callback: Callback<any>): Unlisten {
    const listener = () => {
      callback()
    }

    document.body.addEventListener('click', listener)

    return () => {
      document.body.removeEventListener('click', listener)
    }
  }
  async saveUser(): Promise<any> {
    return {}
  }
}

interface ISystem {
  createA(): A
}

class System implements ISystem {
  createA(): A {
    const a = new A()

    return a
  }
}

const system = new System()

window.onmessage = (event: MessageEvent) => {
  const { data } = event

  const { type: _type, method: _method, data: _data } = data

  switch (_type) {
    case 'call':
    case 'watch':
    case 'ref':
  }
}

/// process A

const channel: IPort = {
  send: function (message: any) {
    throw new MethodNotImplementedError()
  },
  onmessage: function (event: DataEvent) {
    throw new MethodNotImplementedError()
  },
  onerror: function (event: _ErrorEvent) {
    throw new MethodNotImplementedError()
  },
  terminate: function () {
    throw new MethodNotImplementedError()
  },
}

const remoteSystem = createAPI<ISystem>(
  `
  interface ISystem {
    createA(): A
  }
`,
  channel
)

;(async () => {
  const a = await remoteSystem.createA()

  const result = await a.increment(1)
})()

function createAPI<T>(spec: string, chane): T {
  throw new MethodNotImplementedError()
}
