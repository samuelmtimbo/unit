import { Functional } from '../../../../Class/Functional'

export interface I {
  a: string[]
  sep: string
}

export interface O {
  str: string
}

export default class Join extends Functional<I, O> {
  constructor() {
    super({
      i: ['a', 'sep'],
      o: ['str'],
    })
  }

  f({ a, sep }: I, done): void {
    const str = a.join(sep)
    done({ str })
  }
}
