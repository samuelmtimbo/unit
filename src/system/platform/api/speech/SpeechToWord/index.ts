import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'

export type I = {
  lang: string
}

export type O = {
  message: string
}

export default class SpeechToWord extends Functional<I, O> {
  constructor() {
    super({
      i: ['lang'],
      o: ['message'],
    })
  }

  f({ lang }: I, done: Done<O>) {
    // @ts-ignore
    window.SpeechRecognition =
      // @ts-ignore
      window.webkitSpeechRecognition || window.SpeechRecognition

    // @ts-ignore
    window.SpeechGrammarList =
      // @ts-ignore
      window.webkitSpeechGrammarList || window.SpeechGrammarList

    if ('SpeechRecognition' in window) {
      // @ts-ignore
      const recognition = new window.SpeechRecognition()

      // setup grammar
      const grammar =
        '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
      // @ts-ignore
      const speechRecognitionList = new window.SpeechGrammarList()
      speechRecognitionList.addFromString(grammar, 1)
      recognition.grammars = speechRecognitionList

      recognition.lang = lang
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.continuous = false
      recognition.onerror = (event) => {
        // @ts-ignore
        if (event.error === 'aborted' || event.error === 'no-speech') {
          done({})
          return
        }
        // @ts-ignore
        return done(undefined, event.error)
      }
      recognition.onresult = (event) => {
        const results = event.results
        const firstResult = results[0]
        const firstAlternative = firstResult[0]
        const { transcript, confidence } = firstAlternative
        done({
          message: transcript.toLowerCase(),
        })
      }

      recognition.addEventListener('end', () => {
        console.log('end')
        // done({
        //   message: '',
        // })
      })

      // recognition.addEventListener('audioend', () => {})

      recognition.start()
    } else {
      done(undefined, 'not supported')
    }
  }
}
