import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'
import { Dict } from '../../../../types/Dict'

export interface I<T> {
  style?: Dict<string>
  strokeStyle?: string
}

export interface O<T> {}

export default class HSVColorPicker<T> extends Element<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'h', 's', 'v'],
        o: [],
      },
      config
    )
  }

  onDataInputData(name: string) {}
}
