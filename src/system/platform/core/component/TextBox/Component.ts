import { localComponentClassFromSpec } from '../../../../../client/unitComponentClassFromSpec'
import { Dict } from '../../../../../types/Dict'
import { GraphSpec } from '../../../../../types/GraphSpec'
import { SpeechRecognitionOpt } from '../../../../../types/global/SpeechRecognition'
import spec = require('../../../core/component/TextBox/spec.json')

export interface Props {
  className?: string
  style?: Dict<string>
  opt?: SpeechRecognitionOpt
}

export default class TextBox extends localComponentClassFromSpec<
  HTMLDivElement,
  Props
>(spec as GraphSpec) {}
