import { Functional } from '../../../../Class/Functional'

export interface I {
  str: string
  regex: string
}

export interface O {
  match: string
}

export default class Match extends Functional<I, O> {
  constructor() {
    super({
      i: ['str', 'regex'],
      o: ['match'],
    })
  }

  f({ str, regex }: I, done): void {
    done({ match: str.match(regex) })
  }
}
