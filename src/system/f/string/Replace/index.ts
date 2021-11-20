import { Functional } from '../../../../Class/Functional'

export interface I {
  a: string
  regex: string
  replacement: string
}

export interface O {
  a: string
}

export default class Replace extends Functional<I, O> {
  constructor() {
    super({
      i: ['a', 'regex', 'replacement'],
      o: ['a'],
    })
  }

  f({ a, regex, replacement }: I, done): void {
    done({ a: a.replace(new RegExp(regex, 'g'), replacement) })
  }
}
