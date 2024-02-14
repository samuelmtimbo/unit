import { API } from '../../../../API'
import { BootOpt } from '../../../../system'

export function webSpeech(window: Window, opt: BootOpt): API['speech'] {
  const speech: API['speech'] = {
    SpeechRecognition:
      // @ts-ignore
      window.SpeechRecognition || window.webkitSpeechRecognition,
    SpeechGrammarList:
      // @ts-ignore
      window.SpeechGrammarList || window.webkitSpeechGrammarList,
    SpeechSynthesis: window.speechSynthesis,
    // @ts-ignore
    SpeechSynthesisUtterance: window.SpeechSynthesisUtterance,
  }

  return speech
}
