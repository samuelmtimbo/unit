import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { ISpeechSynthesis } from '../../../../../types/global/ISpeechSynthesis'

export type I = {
  message: string
  voice: number
}

export type O = {}

export default class SpeechSynthesis extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['message', 'voice'],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  f({ message, voice }: I, done: Done<O>) {
    const {
      api: {
        speech: { SpeechSynthesis, SpeechSynthesisUtterance },
      },
    } = this.__system
    if (message === '') {
      done()
      return
    }

    let synth: ISpeechSynthesis

    try {
      synth = SpeechSynthesis({})
    } catch (err) {
      done(undefined, err.message)
      return
    }

    let voices = []

    const speak = () => {
      voices = synth.getVoices()
      if (voices.length > 0) {
        _speak()
      } else {
        // AD HOC
        // [Chrome]
        setTimeout(() => {
          speak()
        }, 100)
      }
    }

    const _speak = () => {
      if (voice < 0 || voice > voices.length - 1) {
        done(undefined, 'voice index out of range')
        return
      }

      const _voice = voices[voice]
      const utterance = SpeechSynthesisUtterance({
        text: message,
        voice: _voice,
      })
      utterance.addEventListener('error', (err) => {
        done(undefined, err.error)
      })
      utterance.addEventListener('end', () => {
        done()
      })
      synth.speak(utterance)
    }

    speak()
  }
}
