import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ISpeechRecognitionOpt } from '../../../../../types/global/ISpeechRecognition'
import { EE } from '../../../../../types/interface/EE'
import { ID_SPEECH_RECOGNITION } from '../../../../_ids'

export type I = {
  opt: ISpeechRecognitionOpt
}

export type O = {
  emitter: EE
}

export default class SpeechRecognition extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['opt'],
        o: ['emitter'],
      },
      {},
      system,
      ID_SPEECH_RECOGNITION
    )
  }

  f({ opt }: I, done: Done<O>) {
    // TODO
  }
}
