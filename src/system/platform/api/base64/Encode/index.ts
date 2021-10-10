import { Config } from '../../../../../Class/Unit/Config'
import { SISO } from '../../../../../SISO'

export default class Encode extends SISO<string, string> {
  constructor(config?: Config) {
    super(
      {
        input: 'a',
        output: 'b',
      },
      config
    )
  }

  s(a: string): string {
    return btoa(a)
  }
}
