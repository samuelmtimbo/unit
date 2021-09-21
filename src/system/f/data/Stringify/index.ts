import { Config } from '../../../../Class/Unit/Config'
import { SISO } from '../../../../SISO'
import { stringify } from '../../../../spec/stringify'

export default class Stringify extends SISO<any, string> {
  constructor(config?: Config) {
    super(
      {
        input: 'a',
        output: 'str',
      },
      config
    )
  }

  s(a: any): string {
    return stringify(a)
  }
}
