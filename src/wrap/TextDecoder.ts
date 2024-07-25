import { $ } from '../Class/$'
import { System } from '../system'
import { TD } from '../types/interface/TD'

export function wrapTextDecoder(decoder: TextDecoder, system: System): TD & $ {
  const ctx = new (class Node extends $ implements TD {
    __: string[] = ['TD']

    decode(opt: TextDecodeOptions, data: ArrayBuffer): string {
      return decoder.decode(data, opt)
    }
  })(system)

  return ctx
}
