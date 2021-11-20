import { Functional } from '../../../../Class/Functional'

export interface I<T> {
  any: T
}

export interface O<T> {
  now: number
}

export default class Now<T> extends Functional<I<T>, O<T>> {
  constructor() {
    super({
      i: ['any'],
      o: ['now'],
    })
  }

  f({ any }: Partial<I<T>>, done): void {
    done({ now: new Date().getTime() })
  }
}
