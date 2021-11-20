import { Element } from '../../../../Class/Element/Element'
import { Dict } from '../../../../types/Dict'

export interface I<T> {
  style?: Dict<string>
  strokeStyle?: string
}

export interface O<T> {}

export default class HSVColorPicker<T> extends Element<I<T>, O<T>> {
  constructor() {
    super({
      i: ['style', 'h', 's', 'v'],
      o: [],
    })
  }

  onDataInputData(name: string) {}
}
