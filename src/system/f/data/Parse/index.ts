import { Config } from '../../../../Class/Unit/Config'
import { SISO } from '../../../../SISO'
import { evaluate } from '../../../../spec/evaluate'

export default class Parse extends SISO<string, any> {
  constructor(config?: Config) {
    super(
      {
        input: 'str',
        output: 'a',
      },
      config
    )
  }

  s(str: string): string {
    return evaluate(str)
  }
}
