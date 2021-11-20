import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { ISpeechRecognitionOpt } from '../../../../../api/speech'
import { EE } from '../../../../../interface/EE'

export type I = {
  opt: ISpeechRecognitionOpt
}

export type O = {
  emitter: EE
}

export default class SpeechRecognition extends Functional<I, O> {
  constructor() {
    super({
      i: ['opt'],
      o: ['emitter'],
    })
  }

  f({ opt }: I, done: Done<O>) {
    // TODO
  }
}
