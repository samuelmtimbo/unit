import { $ } from '../Class/$'
import { System } from '../system'
import { TE } from '../types/interface/TE'

export function wrapTextEncoder(encoder: TextEncoder, system: System): TE & $ {
  const ctx = new (class Node extends $ implements TE {
    __: string[] = ['TD']

    encode(opt: {}, text: string): Uint8Array {
      return encoder.encode(text)
    }
  })(system)

  return ctx
}
