import { SELF } from '../../constant/SELF'
import { Spec, Specs } from '../../types'
import { IO } from '../../types/IO'
import { upperCaseFirstLetter } from '../../util/string'

export const SEPARATOR = '/'
export const LINK_SEPARATOR = '_'

export const INPUT = 'input'
export const OUTPUT = 'output'

export const I = 'i'
export const O = 'o'

export const MERGE = '@'
export const DATA = '#'
export const TYPE = '$'
export const EXTERNAL = '%'
export const INTERNAL = '^'
export const ERR = '!'

const UNIT_ID_REGEX = `[^${SEPARATOR}${MERGE}${DATA}${TYPE}${EXTERNAL}${INTERNAL}]+`
const PIN_ID_REGEX = `[^]+`

const UNIT_NODE_ID_REGEX = `^(${UNIT_ID_REGEX})$`
const PIN_NODE_ID_REGEX = `^(${UNIT_ID_REGEX})/(input|output)/(${PIN_ID_REGEX})$`
const NODE_ID_REGEX = `((${UNIT_ID_REGEX})|(${UNIT_ID_REGEX})/(input|output)/(${PIN_ID_REGEX})|(${MERGE}/${UNIT_ID_REGEX}))`
const INPUT_NODE_ID_REGEX = `^(${UNIT_ID_REGEX})/input/(${PIN_ID_REGEX})$`
const OUTPUT_NODE_ID_REGEX = `^(${UNIT_ID_REGEX})/output/(${PIN_ID_REGEX})$`

export const idRegex = new RegExp(`^${UNIT_ID_REGEX}$`)
export const nodeIdRegex = new RegExp(`^${NODE_ID_REGEX}$`)
export const unitIdRegex = new RegExp(UNIT_NODE_ID_REGEX)
export const pinIdRegex = new RegExp(PIN_NODE_ID_REGEX)
export const inputIdRegex = new RegExp(INPUT_NODE_ID_REGEX)
export const outputIdRegex = new RegExp(OUTPUT_NODE_ID_REGEX)
export const dataRegex = new RegExp(`^${DATA}/[^#_]+$`)
export const metadataRegex = new RegExp(`^\\$/[^]+/${UNIT_ID_REGEX}$`)
export const mergeRegex = new RegExp(`^${MERGE}/[^/#$]+$`)
export const externalRegex = new RegExp(
  `^${EXTERNAL}/(input|output)/[^${SEPARATOR}${DATA}${MERGE}]+$`
)
export const internalRegex = new RegExp(
  `^\\${INTERNAL}/(input|output)/${PIN_ID_REGEX}/[^${SEPARATOR}${DATA}${MERGE}]+$`
)
export const linkRegex = new RegExp(`^(.+)${LINK_SEPARATOR}(.+)$`)

function tail<T>(array: T[]): T[] {
  return array.slice(1, array.length)
}

function dropLast<T>(array: T[]): T[] {
  return array.slice(0, array.length - 1)
}

function last<T>(array: T[]): T {
  return array[array.length - 1]
}

export function getDatumNodeIdFromDatumLinkId(linkId: string): string {
  const { source, target } = segmentLinkId(linkId)
  return isDatumNodeId(source) ? source : target
}

export function getTypeFromLinkPinNodeId(linkPinNodeId: string): IO {
  return linkPinNodeId.split('/')[1] as IO
}

export function getPinIdFromLinkPinNodeId(nodeId: string) {
  return nodeId.split('/')[2] as string
}

export function getIdFromDatumNodeId(nodeId: string) {
  const { datumId: id } = segmentDatumNodeId(nodeId)
  return id
}

export function getPinIdClass(pinNodeId: string): string {
  if (isOutputPinId(pinNodeId)) {
    return 'output'
  }

  if (isInputPinId(pinNodeId)) {
    return 'input'
  }

  throw `Input with id "${pinNodeId}" was not found`
}

export const getPinNodeId = (
  unitId: string,
  type: IO,
  pinId: string
): string => {
  return `${unitId}/${type}/${pinId}`
}

export const getPinNodeId_ = (
  unitId: string
): ((type: IO, pinId: string) => string) => {
  return (type, pinId) => `${unitId}/${type}/${pinId}`
}

export const getPinNodeId__ = (
  unitId: string,
  type: IO
): ((pinId: string) => string) => {
  return (pinId) => `${unitId}/${type}/${pinId}`
}

export function getInputNodeId(unitId: string, pinId: string) {
  return `${unitId}/input/${pinId}`
}

export function getOutputNodeId(unitId: string, pinId: string) {
  return `${unitId}/output/${pinId}`
}

export function getSelfPinNodeId(unitId: string): string {
  return getOutputNodeId(unitId, SELF)
}

export function getLinkId(source: string, targetId: string) {
  return `${source}${LINK_SEPARATOR}${targetId}`
}

export function getPinLinkId(unitId: string, type: IO, pinId: string): string {
  const pinNodeId = getPinNodeId(unitId, type, pinId)
  if (type === 'input') {
    return getLinkId(pinNodeId, unitId)
  } else {
    return getLinkId(unitId, pinNodeId)
  }
}

export function getPinLinkIdFromPinNodeId(pinNodeId: string) {
  const { unitId, type, pinId } = segmentLinkPinNodeId(pinNodeId)
  return getPinLinkId(unitId, type, pinId)
}

export function isNodeId(text: string): boolean {
  return isUnitNodeId(text) || isPinNodeId(text)
}

export function isInternalNodeId(nodeId: string): boolean {
  return internalRegex.test(nodeId)
}

export function isOutputPinId(nodeId: string) {
  return outputIdRegex.test(nodeId)
}

export function isUnitNodeId(nodeId: string): boolean {
  return !!unitIdRegex.exec(nodeId)
}

export function isPinId(nodeId: string): boolean {
  if (nodeId) {
    return isInputPinId(nodeId) || isOutputPinId(nodeId)
  } else {
    return false
  }
}

export function getUnitIdFromNodeId(nodeId: string): string {
  if (isUnitNodeId(nodeId)) {
    return nodeId
  } else {
    const [unitId] = nodeId.split('/') as [string]
    return unitId
  }
}

export function isLinkId(linkId: string) {
  return !!linkRegex.exec(linkId)
}

export function isPinLinkId(linkId: string) {
  const [source, target] = linkId.split(LINK_SEPARATOR)
  return (
    (isUnitNodeId(source) && isPinId(target)) ||
    (isPinId(source) && isUnitNodeId(target))
  )
}

export function isDatumLinkId(linkId: string) {
  const [source, target] = linkId.split(LINK_SEPARATOR)
  return (
    (isPinNodeId(source) && isDatumNodeId(target)) ||
    (isDatumNodeId(source) && isPinNodeId(target))
  )
}

export function isMetaLinkId(linkId: string) {
  const [source, target] = linkId.split(LINK_SEPARATOR)
  return isMetadataNodeId(source)
}

export function isExternalLinkId(linkId: string) {
  const [source, target] = linkId.split(LINK_SEPARATOR)
  return (
    isExternalNodeId(source) ||
    isExternalNodeId(target) ||
    isInternalNodeId(source) ||
    isInternalNodeId(target)
  )
}

export function getErrNodeId(unit_id: string): string {
  return `${ERR}/${unit_id}`
}

export function segmentErrNodeId(errNodeId: string): { unitId: string } {
  const unitId = errNodeId.substr(2, errNodeId.length)
  return {
    unitId,
  }
}

export function segmentLinkPinNodeId(pinNodeId: string): {
  unitId: string
  pinId: string
  type: IO
} {
  const [unitId, type, pinId] = pinNodeId.split('/') as [string, IO, string]
  return {
    unitId,
    type,
    pinId,
  }
}

export function segmentLinkId(linkId: string): {
  source: string
  target: string
} {
  const [source, target] = linkId.split(LINK_SEPARATOR) as [string, string]
  return {
    source,
    target,
  }
}

export function segmentPinLinkId(linkId: string): {
  unitId: string
  pinNodeId: string
} {
  const { source, target } = segmentLinkId(linkId)
  const unitId = isUnitNodeId(source) ? source : target
  const pinNodeId = isUnitNodeId(source) ? target : source
  return {
    unitId,
    pinNodeId,
  }
}

export function segmentDatumLinkId(linkId: string): {
  datumNodeId: string
  pinNodeId: string
} {
  const { source, target } = segmentLinkId(linkId)
  const sourceIsDatum = isDatumNodeId(source)
  const datumNodeId = sourceIsDatum ? source : target
  const pinNodeId = sourceIsDatum ? target : source
  return {
    datumNodeId,
    pinNodeId,
  }
}

export function segmentMetaLinkId(linkId: string): {
  nodeId: string
  metadataNodeId: string
} {
  const { source, target } = segmentLinkId(linkId)
  const nodeId = target
  const metadataNodeId = source
  return {
    nodeId,
    metadataNodeId,
  }
}

export function segmentExternalLinkId(linkId: string): {
  externalNodeId: string
  nodeId: string
} {
  const { source, target } = segmentLinkId(linkId)
  const sourceExternal = isExternalNodeId(source)
  const externalNodeId = sourceExternal ? target : source
  const nodeId = sourceExternal ? source : target
  return {
    nodeId,
    externalNodeId,
  }
}

export function getPinNodeIdFromPinLinkId(linkId: string): string {
  const { source, target } = segmentLinkId(linkId)
  return isUnitNodeId(source) ? target : source
}

export function getUnitIdFromPinLinkId(linkId: string): string {
  const { source, target } = segmentLinkId(linkId)
  return isUnitNodeId(source) ? source : target
}

export function isInputPinId(nodeId: string) {
  return inputIdRegex.test(nodeId)
}

export function isPinNodeId(nodeId: string): boolean {
  // return isLinkPinNodeId(id) || isMergeNodeId(id) || isExternalNodeId(id)
  return isLinkPinNodeId(nodeId) || isMergeNodeId(nodeId)
}

export function isLinkPinNodeId(nodeId: string) {
  return pinIdRegex.test(nodeId)
}

export function isErrPinId(pinNodeId: string): boolean {
  return (
    isOutputPinId(pinNodeId) && segmentLinkPinNodeId(pinNodeId).pinId === 'err'
  )
}

export function segmentCount(path: string): number {
  return path.split('/').length
}

export function getSelectionId(nodeId: string, type: string) {
  return `${nodeId}/selection/${type}`
}

export function sameUnit(pinId0: string, pinId1: string): boolean {
  return getUnitIdFromNodeId(pinId0) === getUnitIdFromNodeId(pinId1)
}

export function getDatumNodeId(nodeId: string): string {
  return `${DATA}/${nodeId}`
}

export function isDatumNodeId(nodeId: string): boolean {
  return !!dataRegex.exec(nodeId)
}

export function segmentDatumNodeId(datumNodeId: string): { datumId: string } {
  const id = datumNodeId.substr(2, datumNodeId.length)
  return {
    datumId: id,
  }
}

export function getMetadataNodeId(nodeId: string, name: string): string {
  return `${TYPE}/${nodeId}/${name}`
}

export function getTypeNodeId(nodeId: string): string {
  return `${TYPE}/${nodeId}`
}

export function isMetadataNodeId(nodeId: string): boolean {
  return !!metadataRegex.exec(nodeId)
}

export function segmentMetadataId(metadataNodeId: string): {
  nodeId: string
  id: string
} {
  const segments = tail(metadataNodeId.split('/'))
  const id = last(segments)!
  const nodeId = dropLast(segments).join('/')

  return {
    nodeId,
    id,
  }
}

export function getMergeNodeId(mergeId: string): string {
  return `${MERGE}/${mergeId}`
}

export function isMergeNodeId(nodeId: string): boolean {
  return mergeRegex.test(nodeId)
}

export function segmentMergeNodeId(mergeNodeId: string): { mergeId: string } {
  // remove '@/'
  const mergeId = mergeNodeId.substring(2, mergeNodeId.length)
  return {
    mergeId,
  }
}

export function getIdFromMergeNodeId(mergeNodeId: string): string {
  const { mergeId } = segmentMergeNodeId(mergeNodeId)

  return mergeId
}

export function getExtNodeId(
  type: IO,
  pinId: string,
  subPinId: string
): string {
  return `${EXTERNAL}/${type}/${pinId}/${subPinId}`
}

export function getExtNodeIdFromIntNodeId(intNodeId: string): string {
  const { type, pinId, subPinId } = segmentInternalNodeId(intNodeId)

  return getExtNodeId(type, pinId, subPinId)
}

export function getIntNodeIdFromExtNodeId(ext_node_id: string): string {
  const { type, pinId, subPinId } = segmentPlugNodeId(ext_node_id)

  return getIntNodeId(type, pinId, subPinId)
}

export function getIntNodeId(
  type: IO,
  pinId: string,
  subPinId: string
): string {
  return `${INTERNAL}/${type}/${pinId}/${subPinId}`
}

export function isExternalNodeId(pinId: string): boolean {
  return externalRegex.test(pinId)
}

export function segmentPlugNodeId(exposedNodeId: string): {
  pinId: string
  type: IO
  subPinId: string
} {
  const [_, type, pinId, subPinId] = exposedNodeId.split('/') as [
    string,
    IO,
    string,
    string
  ]
  return {
    type,
    pinId,
    subPinId,
  }
}

export function segmentInternalNodeId(internalNodeId: string): {
  pinId: string
  type: IO
  subPinId: string
} {
  const [_, type, pinId, subPinId] = internalNodeId.split('/') as [
    string,
    IO,
    string,
    string
  ]
  return {
    type,
    pinId,
    subPinId,
  }
}

export const rangeArray = (n: number): number[] => {
  const range: number[] = []
  for (let i = 0; i < n; i++) {
    range.push(i)
  }
  return range
}

export const harmonicArray = (n: number): number[] => {
  if (n === 0) {
    return []
  }
  const array: number[] = [0]
  for (let i = 1; i < n; i++) {
    array.push(array[i - 1] + 1 / i)
  }
  return array
}

export function isBaseSpecId(specs: Specs, id: string): boolean {
  const spec = specs[id]

  return isBaseSpec(spec)
}

export function isBaseSpec(spec: Spec): boolean {
  const { base } = spec
  return !!base
}

export const numberOrDefault = (n: any, def: number) => {
  if (typeof n === 'number') {
    return n
  }
  return def
}

export function kebabToCamel(str: string): string {
  const segments = str.split(/\s*-\s*/)
  const first_segment = segments[0]
  const segments_tail = segments.slice(1)
  const camelled_segments_tail = segments_tail.map((_str) =>
    upperCaseFirstLetter(_str)
  )
  const camel = first_segment + camelled_segments_tail.join('')
  return camel
}

export function camelToKebab(str: string): string {
  const segments = str.split(/(?=[A-Z])/)
  const kebab = segments.map((_str) => _str.toLowerCase()).join('-')
  return kebab
}

export function camelToSnake(str: string): string {
  const segments = str.split(/(?=[A-Z])/)
  const kebab = segments.map((_str) => _str.toLowerCase()).join('_')
  return kebab
}

export function camelToDashed(str: string): string {
  const segments = str.split(/(?=[A-Z])/)
  const kebab = segments.map((_str) => _str.toLowerCase()).join('-')
  return kebab
}

export function kebabCase(str: string): string {
  return str.toLowerCase().replace(' ', '-')
}
