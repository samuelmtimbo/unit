import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { makeHTML } from '../../../../../client/html'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { BundleSpec } from '../../../../../types/BundleSpec'

export type I = {
  bundle: BundleSpec
  opt: {}
}

export type O = {
  html: string
}

export default class BundleToHTML extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super({ i: ['bundle', 'opt'], o: ['html'] }, {}, system, pod)
  }

  f({ bundle, opt }: I, done: Done<O>): void {
    const html = makeHTML(bundle, opt)

    done({ html })
  }
}
