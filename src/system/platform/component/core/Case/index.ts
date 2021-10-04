import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { Dict } from '../../../../../types/Dict'

export interface I<T> {
  id?: string
  style?: Dict<string>
}

export interface O<T> {}

export default class Case<T> extends Element<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'id'],
        o: [],
      },
      config
    )
  }

  onDataInputData(name: string) {}
}
