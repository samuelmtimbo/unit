import { Element } from '../../../../../Class/Element/Element'

export interface I<T> {
  id: string
}

export interface O<T> {}

export default class Class<T> extends Element<I<T>, O<T>> {
  constructor() {
    super({
      i: ['id'],
      o: [],
    })
  }
}
