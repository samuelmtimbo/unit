import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { BootOpt } from '../../../../system'
import {
  ISpeechGrammarList,
  ISpeechGrammarListOpt,
} from '../../../../types/global/ISpeechGrammarList'
import {
  ISpeechRecognition,
  ISpeechRecognitionOpt,
} from '../../../../types/global/ISpeechRecognition'
import {
  ISpeechSynthesis,
  ISpeechSynthesisOpt,
} from '../../../../types/global/ISpeechSynthesis'
import {
  ISpeechSynthesisUtterance,
  ISpeechSynthesisUtteranceOpt,
} from '../../../../types/global/ISpeechSynthesisUtterance'
import { Unlisten } from '../../../../types/Unlisten'

export function webSpeech(window: Window, opt: BootOpt): API['speech'] {
  const SpeechRecognition = ({
    lang,
    grammars,
    continuous,
    interimResults,
    maxAlternatives,
  }: ISpeechRecognitionOpt): ISpeechRecognition => {
    const SpeechRecognition_ =
      // @ts-ignore
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition_) {
      throw new APINotSupportedError('Speech')
    }

    const recognition = new SpeechRecognition_()

    if (grammars) {
      recognition.grammars = grammars
    }
    recognition.lang = lang
    recognition.interimResults = interimResults
    recognition.maxAlternatives = maxAlternatives
    recognition.continuous = continuous

    const speechRecognition: ISpeechRecognition = {
      start: function (): void {
        recognition.start()
      },
      stop: function (): void {
        recognition.stop()
      },
      addListener: function (event, listener): Unlisten {
        let _listener = listener
        if (event === 'error') {
          _listener = ({ error }) => {
            if (error === 'aborted' || error === 'no-speech') {
              return
            }
            listener(error)
          }
        } else if (event === 'result') {
          _listener = (event) => {
            const results = event.results
            listener(results)
          }
        }
        recognition.addEventListener(event, _listener)
        return () => {
          recognition.removeEventListener(event, _listener)
        }
      },
    }

    return speechRecognition
  }

  const SpeechGrammarList = (
    opt: ISpeechGrammarListOpt
  ): ISpeechGrammarList => {
    const SpeechGrammarList_ =
      // @ts-ignore
      window.SpeechGrammarList || window.webkitSpeechGrammarList
    if (!SpeechGrammarList_) {
      throw new APINotSupportedError('Speech')
    }

    const speechRecognitionList = new SpeechGrammarList_()

    return speechRecognitionList
  }

  const SpeechSynthesis = (opt: ISpeechSynthesisOpt): ISpeechSynthesis => {
    if (!window.speechSynthesis) {
      throw new APINotSupportedError('Speech Synthesis')
    }

    const { speechSynthesis } = window

    return {
      getVoices: () => {
        return speechSynthesis.getVoices()
      },
      speak(utterance: ISpeechSynthesisUtterance): void {
        speechSynthesis.speak(utterance)
      },
    }
  }

  const SpeechSynthesisUtterance = ({
    text,
    voice,
  }: ISpeechSynthesisUtteranceOpt): ISpeechSynthesisUtterance => {
    // @ts-ignore
    if (!window.SpeechSynthesisUtterance) {
      throw new APINotSupportedError('Speech Synthesis')
    }

    // @ts-ignore
    const utterance = new window.SpeechSynthesisUtterance(text)
    utterance.voice = voice

    return utterance
  }

  const speech = {
    SpeechRecognition,
    SpeechGrammarList,
    SpeechSynthesis,
    SpeechSynthesisUtterance,
  }

  return speech
}
