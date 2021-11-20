import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {}

export interface O<T> {}

export default class IOUNAPPUser<T> extends Element<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: [],
        o: [],
      },
      config
    )
  }
}
