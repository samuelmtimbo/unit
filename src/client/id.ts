import { SELF } from '../constant/SELF'
import { ComponentSpec, GraphComponentSpec, GraphSpec, Spec } from '../types'
import { Dict } from '../types/Dict'
import assert from '../util/assert'
import { isEmptyObject } from '../util/object'

export const SEPARATOR = '/'
export const LINK_SEPARATOR = '_'

export const INPUT = 'input'
export const OUTPUT = 'output'

export const MERGE = '@'
export const DATA = '#'
export const TYPE = '$'
export const EXTERNAL = '%'
export const INTERNAL = '^'
export const COMPONENT = '&'
export const ERR = '!'

const UNIT_ID_REGEX = `[^${SEPARATOR}${MERGE}${DATA}${TYPE}${EXTERNAL}]+`
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
export const dataRegex = new RegExp(`^${DATA}\/[^#_]+$`)
export const metadataRegex = new RegExp(`^\\$/[^]+/${UNIT_ID_REGEX}$`)
export const mergeRegex = new RegExp(`^${MERGE}\/[^/#$]+$`)
export const externalRegex = new RegExp(
  `^${EXTERNAL}\/(input|output)\/[^${SEPARATOR}${DATA}${MERGE}]+$`
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

export function getUnitIdFromId(id: string): string {
  return id.split('/')[0] as string
}

export function getDatumNodeIdFromDatumLinkId(linkId: string): string {
  const { source, target } = segmentLinkId(linkId)
  return isDatumNodeId(source) ? source : target
}

export function getUnitIdFromPinId(id: string) {
  return getUnitIdFromId(id)
}

export function getTypeFromLinkPinNodeId(id: string): 'input' | 'output' {
  return id.split('/')[1] as 'input' | 'output'
}

export function getPinIdFromLinkPinNodeId(nodeId: string) {
  return nodeId.split('/')[2] as string
}

export function getIdFromDatumNodeId(nodeId: string) {
  const { id } = segmentDatumNodeId(nodeId)
  return id
}

export function getPinIdClass(id: string): string {
  if (isOutputPinId(id)) {
    return 'output'
  }

  if (isInputPinId(id)) {
    return 'input'
  }

  throw `Input with id "${id}" was not found`
}

export const getPinNodeId = (
  unitId: string,
  type: 'input' | 'output',
  pinId: string
): string => {
  return `${unitId}/${type}/${pinId}`
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

export const getComponentNodeId = (unitId: string): string => {
  return `${COMPONENT}/${unitId}`
}

export function getBoundaryNodeId(unitId: string, pinId: string) {
  return `${unitId}/boundary/${pinId}`
}

export function getNodeLabelId(id: string): string {
  return `${id}/label`
}

export function getLinkId(source: string, targetId: string) {
  return `${source}${LINK_SEPARATOR}${targetId}`
}

export function getPinLinkId(
  unitId: string,
  type: 'input' | 'output',
  pinId: string
): string {
  const pinNodeId = getPinNodeId(unitId, type, pinId)
  if (type === 'input') {
    return getLinkId(pinNodeId, unitId)
  } else {
    return getLinkId(unitId, pinNodeId)
  }
}

export function getComponentLinkId(unitId: string): string {
  const componentNodeId = getComponentNodeId(unitId)
  return getLinkId(unitId, componentNodeId)
}

export function getPinLinkIdFromPinNodeId(pinNodeId: string) {
  const { unitId, type, pinId } = segmentLinkPinNodeId(pinNodeId)
  return getPinLinkId(unitId, type, pinId)
}

export function isNodeId(id: string): boolean {
  return isUnitNodeId(id) || isPinNodeId(id)
}

export function isInternalNodeId(id: string): boolean {
  return isUnitNodeId(id) || isMergeNodeId(id) || isLinkPinNodeId(id)
}

export function isOutputPinId(id: string) {
  return outputIdRegex.test(id)
}

export function isUnitNodeId(nodeId: string): boolean {
  return !!unitIdRegex.exec(nodeId)
}

export function isPinId(id: string): boolean {
  if (id) {
    return isInputPinId(id) || isOutputPinId(id)
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

export function isLinkId(id: string) {
  return !!linkRegex.exec(id)
}

export function isPinLinkId(id: string) {
  const [source, target] = id.split(LINK_SEPARATOR)
  return (
    (isUnitNodeId(source) && isPinId(target)) ||
    (isPinId(source) && isUnitNodeId(target))
  )
}

export function isDatumLinkId(id: string) {
  const [source, target] = id.split(LINK_SEPARATOR)
  return (
    (isPinNodeId(source) && isDatumNodeId(target)) ||
    (isDatumNodeId(source) && isPinNodeId(target))
  )
}

export function isMetaLinkId(id: string) {
  const [source, target] = id.split(LINK_SEPARATOR)
  return isMetadataNodeId(source)
}

export function isExternalLinkId(id: string) {
  const [source, target] = id.split(LINK_SEPARATOR)
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
  type: 'input' | 'output'
} {
  const [unitId, type, pinId] = pinNodeId.split('/') as [
    string,
    'input' | 'output',
    string
  ]
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
  const externalNodeId = sourceExternal ? source : target
  const nodeId = sourceExternal ? target : source
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

export function isInputPinId(id: string) {
  return inputIdRegex.test(id)
}

export function isPinNodeId(id: string): boolean {
  // return isLinkPinNodeId(id) || isMergeNodeId(id) || isExternalNodeId(id)
  return isLinkPinNodeId(id) || isMergeNodeId(id)
}

export function isLinkPinNodeId(id: string) {
  return pinIdRegex.test(id)
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

export function randomInArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function sameUnit(id0: string, id1: string): boolean {
  return getUnitIdFromNodeId(id0) === getUnitIdFromNodeId(id1)
}

export function getDatumNodeId(id: string): string {
  return `${DATA}/${id}`
}

export function isDatumNodeId(nodeId: string): boolean {
  return !!dataRegex.exec(nodeId)
}

export function segmentDatumNodeId(datumNodeId: string): { id: string } {
  // remove /#
  const id = datumNodeId.substr(2, datumNodeId.length)
  return {
    id,
  }
}

export function getMetadataNodeId(nodeId: string, id: string): string {
  return `${TYPE}/${nodeId}/${id}`
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

export function getMergeNodeId(id: string): string {
  return `${MERGE}/${id}`
}

export function isMergeNodeId(id: string): boolean {
  return mergeRegex.test(id)
}

export function segmentMergeNodeId(mergeNodeId: string): { id: string } {
  // remove '@/'
  const id = mergeNodeId.substr(2, mergeNodeId.length)
  return {
    id,
  }
}

export function getIdFromMergeNodeId(mergeNodeId: string): string {
  const { id } = segmentMergeNodeId(mergeNodeId)
  return id
}

export function getExternalNodeId(
  type: 'input' | 'output',
  id: string,
  subPinId: string
): string {
  return `${EXTERNAL}/${type}/${id}/${subPinId}`
}

export function getInternalNodeId(
  type: 'input' | 'output',
  id: string,
  subPinId: string
): string {
  return `${INTERNAL}/${type}/${id}/${subPinId}`
}

export function isExternalNodeId(id: string): boolean {
  return externalRegex.test(id)
}

export function segmentExposedNodeId(exposedNodeId: string): {
  id: string
  type: 'input' | 'output'
  subPinId: string
} {
  const [_, type, id, subPinId] = exposedNodeId.split('/') as [
    string,
    'input' | 'output',
    string,
    string
  ]
  return {
    type,
    id,
    subPinId,
  }
}

export function segmentInternalNodeId(internalNodeId: string): {
  id: string
  type: 'input' | 'output'
  subPinId: string
} {
  const [_, type, id, subPinId] = internalNodeId.split('/') as [
    string,
    'input' | 'output',
    string,
    string
  ]
  return {
    type,
    id,
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

export function isBaseSpecId(id: string): boolean {
  const spec = globalThis.__specs[id]
  return isBaseSpec(spec)
}

export function isBaseSpec(spec: Spec): boolean {
  const { base } = spec
  return !!base
}

export function getComponentSpec(id: string): ComponentSpec | undefined {
  const spec = globalThis.__specs[id] as GraphSpec
  const { component } = spec
  return component
}

export function isComponent(id: string): boolean {
  const componentSpec = getComponentSpec(id)
  return isComponentSpec(componentSpec)
}

export function isComponentSpec(componentSpec: GraphComponentSpec): boolean {
  return componentSpec && !isEmptyObject(componentSpec)
}

export const upperCaseFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.substring(1)
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

assert(kebabToCamel('a-b-c') === 'aBC')
assert(kebabToCamel('aBC') === 'aBC')
assert(kebabToCamel('kebab-to-camel') === 'kebabToCamel')
assert(kebabToCamel('kebabToCamel') === 'kebabToCamel')

export function camelToKebab(str: string): string {
  const segments = str.split(/(?=[A-Z])/)
  const kebab = segments.map((_str) => _str.toLowerCase()).join('-')
  return kebab
}

assert(camelToKebab('aBC') === 'a-b-c')
assert(camelToKebab('kebabToCamel') === 'kebab-to-camel')
assert(camelToKebab('a-b-c') === 'a-b-c')

export function camelToSnake(str: string): string {
  const segments = str.split(/(?=[A-Z])/)
  const kebab = segments.map((_str) => _str.toLowerCase()).join('_')
  return kebab
}

assert(camelToSnake('aBC') === 'a_b_c')
assert(camelToSnake('kebabToCamel') === 'kebab_to_camel')
assert(camelToSnake('a_b_c') === 'a_b_c')

export function styleToCSS(style: Dict<any>): string {
  let str = ''
  for (let key in style) {
    const value = style[key]
    str += `${key}`
  }
  return str
}

export function kebabCase(str: string): string {
  return str.toLowerCase().replace(' ', '-')
}

// const assert = require('assert')

// assert(idRegex.exec('a'))

// assert(!nodeIdRegex.exec('a/b/c'))
// assert(!nodeIdRegex.exec('#a'))
// assert(nodeIdRegex.exec('a/input/c'))
// assert(nodeIdRegex.exec('a'))

// assert(isMetadataNodeId('$/abcdef/description'))
// assert(isMetadataNodeId('$/abcdef/input/fdfdrt/data'))
// assert(isMetadataNodeId('$/abcdef/input/a + b/type'))
// assert(isMetadataNodeId('$/#/auergl/type'))
// // assert(!isMetadataNodeId('$/abcdef/input'))
// assert(!isMetadataNodeId('abcdef/data_abcdef'))
// assert(!isMetadataNodeId('abcdef'))

// assert.equal(getPinIdFromPinNodeId('abc/input/def'), 'def')
// assert.equal(getPinIdFromPinNodeId('abc/output/def'), 'def')

// assert.equal(isOutputPinId('abc/output/def'), true)
// assert.equal(isOutputPinId('abc'), false)

// assert(isUnitNodeId('fjjwld'))
// assert(!isUnitNodeId('fjjwld/input/data'))
// assert(!isUnitNodeId('#bcsrew'))
// assert(!isUnitNodeId('%/input/bcsrew'))

// assert(isMergeNodeId('@/abcdef'))
// assert(isMergeNodeId('@/merge0'))
// assert(!isMergeNodeId('abcdef'))
// assert(!isMergeNodeId('merge0'))
// assert(!isMergeNodeId('%/input/merge0'))

// assert(getExternalNodeId('input', 'abcdef', 'ghijlm'), '%/input/abcdef/ghijlm')

// assert(isExternalNodeId('%/input/abcdef'))
// assert(isExternalNodeId('%/output/abcdef'))
// assert(isExternalNodeId('%/output/[a]'))
// assert(isExternalNodeId('%/input/pjcmihkdo'))
// assert(!isExternalNodeId('abcdef'))
// assert(!isExternalNodeId('merge0'))
// assert(!isExternalNodeId('%/input/#/abcdef'))

// // assert.equal(harmonicArray(4), [[0, 1, 3 / 2, 11 / 6]])

// assert.deepEqual(segmentMetadataId('?/abcdef/input/a/data'), {
//   nodeId: 'abcdef/input/a',
//   id: 'data',
// })

// assert.deepEqual(segmentMergeNodeId('@/abcdef'), {
//   id: 'abcdef',
// })

// assert(isLinkId('length_length/output/length'))

// assert.equal(getDatumNodeId('abcdef'), '#/abcdef')

// assert.equal(isDatumNodeId('#/abcdef'), true)
// assert.equal(isDatumNodeId('#/abcdef/input/a'), true)
// assert.equal(isDatumNodeId('#/if/output/a ? b'), true)
// assert.equal(isDatumNodeId('abcdef'), false)
// assert.equal(isDatumNodeId('#/abcdef_abcdef/input/a'), false)
// assert.equal(isDatumNodeId('#/abcdef_abcdef/input/a'), false)

// assert.equal(getMetadataNodeId('abcdef', 'description'), '$/abcdef/description')

// assert.deepEqual(segmentDatumNodeId('#/abcdef/input/a'), {
//   id: 'abcdef/input/a',
// })

// assert(isLinkPinNodeId('pugej/output/a + b'))
// assert(isLinkPinNodeId('pugej/output/a % b'))
// assert(isLinkPinNodeId('pugej/output/a'))
// assert(isLinkPinNodeId('pugej/input/a'))
// assert(!isLinkPinNodeId('%/input/a'))
// assert(!isLinkPinNodeId('%/output/a'))

// assert(isPinNodeId('pugej/output/a + b'))
// assert(isPinNodeId('@/muuja'))
// assert(isPinNodeId('%/input/a'))
// assert(isPinNodeId('%/input/a % b'))

// assert.equal(isInputPinId('wewekd/input/poiguy'), true)

// assert.equal(
//   getPinNodeIdFromPinLinkId('msvsq_mpvsq/output/a'),
//   'mpvsq/output/a'
// )
// assert.equal(getUnitIdFromPinLinkId('msvsq_mpvsq/output/a'), 'msvsq')

// assert.deepEqual(segmentLinkId('?/mpvsq/output/a/type_mpvsq/output/a'), {
//   source: '?/mpvsq/output/a/type',
//   target: 'mpvsq/output/a',
// })
