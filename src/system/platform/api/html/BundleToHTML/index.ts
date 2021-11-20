import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { makeHTML } from '../../../../../client/html'
import { BundleSpec } from '../../../method/process/BundleSpec'

export type I = {
  bundle: BundleSpec
  opt: {}
}

export type O = {
  html: string
}

export default class BundleToHTML extends Functional<I, O> {
  constructor() {
    super({ i: ['bundle', 'opt'], o: ['html'] })
  }

  f({ bundle, opt }: I, done: Done<O>): void {
    const html = makeHTML(bundle, opt)

    done({ html })
  }
}
