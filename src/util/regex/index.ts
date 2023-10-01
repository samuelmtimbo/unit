import { RAW_NUMBER_LITERAL_REGEX } from '../../spec/regex/NUMBER_LITERAL'

export const REGEX_RAW_PERCENT = /[+]{0,1}[-]{0,1}([0-9]+)%/
export const REGEX_PERCENT = new RegExp('^' + REGEX_RAW_PERCENT.source + '$')
export const REGEX_RAW_PX = new RegExp(
  '(' + RAW_NUMBER_LITERAL_REGEX.source + ')px'
)
export const REGEX_PX = new RegExp(
  '^(' + RAW_NUMBER_LITERAL_REGEX.source + ')px$'
)
export const REGEX_CALC =
  /^calc\(([0-9]+)%([+]{0,1}[-]{0,1}[0-9]+(?:\.\d*)?)px\)$/
export const REGEX_GLOBAL_RAW_PX = new RegExp(REGEX_RAW_PX.source, 'g')
export const REGEX_GLOBAL_RAW_PERCENT = new RegExp(
  REGEX_RAW_PERCENT.source,
  'g'
)
