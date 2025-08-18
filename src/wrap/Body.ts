import { $ } from '../Class/$'
import { System } from '../system'
import { BO } from '../types/interface/BO'

export function wrapBody(_body: Body, system: System): BO & $ {
  const body = new (class Body extends $ implements BO {
    __: string[] = ['BO']

    async json(): Promise<any> {
      return _body.json()
    }

    async text(): Promise<string> {
      return _body.text()
    }

    async blob(): Promise<Blob> {
      return _body.blob()
    }

    async raw() {
      return _body
    }

    async arrayBuffer(): Promise<ArrayBuffer> {
      return _body.arrayBuffer()
    }
  })(system)

  return body
}
