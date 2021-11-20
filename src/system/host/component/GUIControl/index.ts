import { Element } from '../../../../Class/Element/Element'

export interface I<T> {}

export interface O<T> {}

export default class IOUNAPPControl<T> extends Element<I<T>, O<T>> {
  constructor() {
    super({
      i: [],
      o: [],
    })
  }
}
