import { Element } from '../../../../../Class/Element/Element'
import { SpeechOpt } from '../../../../../api/speech'

export interface I<T> {
  options?: SpeechOpt
}

export interface O<T> {
  transcript?: string
}

export default class Microphone<T> extends Element<I<T>, O<T>> {
  constructor() {
    super({
      i: ['options'],
      o: ['transcript'],
    })
  }
}
