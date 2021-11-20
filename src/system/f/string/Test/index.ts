import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  str: string
  regex: string
}

export interface O<T> {
  match: boolean
}

export default class Test<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['str', 'regex'],
      o: ['match'],
    })
  }

  f({ str, regex }: Partial<I<T>>, done): void {
    done({ match: !!str.match(regex) })
  }
}
