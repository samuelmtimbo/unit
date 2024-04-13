import { APINotSupportedError } from '../exception/APINotImplementedError'
import { System } from '../system'
import { SpeechGrammarList } from '../types/global/SpeechGrammarList'

export const specNameGrammar = (system: System): SpeechGrammarList => {
  const { specs } = system

  const token_set: Set<string> = new Set()
  for (let id in specs) {
    const spec = specs[id]
    const { name = '' } = spec
    const name_tokens = name.split(' ')
    for (const name_token of name_tokens) {
      token_set.add(name_token)
    }
  }
  const tokens: string[] = Array.from(token_set).sort()

  return grammarsFrom(system, tokens)
}

export const JSGFStrFrom = (tokens: string[]): string => {
  const rule = tokens.join(' | ')
  const grammar = `#JSGF V1.0; grammar tokens; public <token> = ${rule} ;`
  return grammar
}

export const grammarsFrom = (
  system: System,
  tokens: string[]
): SpeechGrammarList => {
  const {
    api: {
      speech: { SpeechGrammarList },
    },
  } = system

  if (!SpeechGrammarList) {
    throw new APINotSupportedError('Speech Grammar List')
  }

  const grammarsStr = JSGFStrFrom(tokens)

  const grammars = new SpeechGrammarList({})

  grammars.addFromString(grammarsStr, 1)

  return grammars
}
