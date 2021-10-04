import { Config } from '../../../../../Class/Unit/Config'
import { SISO } from '../../../../../SISO'

export default class Decode extends SISO<string, string> {
  constructor(config?: Config) {
    super(
      {
        input: 'b',
        output: 'a',
      },
      config
    )
  }

  s(a: string): string {
    try {
      return atob(a)
    } catch {
      throw 'string not correctly enconded'
    }
  }
}
