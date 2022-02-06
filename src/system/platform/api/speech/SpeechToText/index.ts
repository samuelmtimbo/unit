import { SpeechRecorder } from '../../../../../api/speech'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { ISpeechRecognitionOpt } from '../../../../../types/global/ISpeechRecognition'

export type I = {
  opt: ISpeechRecognitionOpt
  stop: any
}

export type O = {
  text: string
}

export default class SpeechToText extends Semifunctional<I, O> {
  private _recorder: SpeechRecorder | null = null

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['opt'],
        fo: [],
        i: ['stop'],
        o: ['text'],
      },
      {},
      system,
      pod
    )
  }

  f({ opt }: I, done: Done<O>) {
    const recorder = new SpeechRecorder(this.__system, opt)

    this._recorder = recorder

    this._recorder.start()

    this._recorder.addListener('transcript', (text) => {
      this._output.text.push(text)
    })

    this._recorder.addListener('err', (err) => {
      done(undefined, err)
    })

    this._recorder.addListener('end', () => {
      this._recorder = null
      done({})
    })
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'stop') {
    this._recorder.stop()
    // }
  }
}
