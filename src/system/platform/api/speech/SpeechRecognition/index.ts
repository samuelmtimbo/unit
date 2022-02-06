import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { EE } from '../../../../../interface/EE'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { ISpeechRecognitionOpt } from '../../../../../types/global/ISpeechRecognition'

export type I = {
  opt: ISpeechRecognitionOpt
}

export type O = {
  emitter: EE
}

export default class SpeechRecognition extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['opt'],
        o: ['emitter'],
      },
      {},
      system,
      pod
    )
  }

  f({ opt }: I, done: Done<O>) {
    // TODO
  }
}
