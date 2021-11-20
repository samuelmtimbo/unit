import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { makeHTML } from '../../../../../client/html'
import { BundleSpec } from '../../../method/process/BundleSpec'

export type I = {
  bundle: BundleSpec
  opt: {}
}

export type O = {
  html: string
}

export default class UnitToHTML extends Functional<I, O> {
  constructor(config: Config) {
    super({ i: ['bundle', 'opt'], o: ['html'] }, config)
  }

  f({ bundle, opt }: I, done: Done<O>): void {
    const html = makeHTML(bundle, opt)

    done({ html })
  }
}
