import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'

export type I = {
  message: string
  voice: number
}

export type O = {}

export default class SpeechSynthesis extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['message', 'voice'],
        o: [],
      },
      config
    )
  }

  f({ message, voice }: I, done: Done<O>) {
    if (window.speechSynthesis) {
      if (message === '') {
        done()
        return
      }
      const synth = window.speechSynthesis
      let voices = []

      const speak = () => {
        voices = synth.getVoices()
        if (voices.length > 0) {
          _speak()
        } else {
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

        const utterance = new SpeechSynthesisUtterance(message)
        utterance.voice = voices[voice] // Google English Female
        utterance.addEventListener('error', (err) => {
          done(undefined, err.error)
        })
        utterance.addEventListener('end', () => {
          done()
        })
        synth.speak(utterance)
      }

      speak()
    } else {
      done(undefined, 'Speech Synthesis API is not supported')
    }
  }
}
