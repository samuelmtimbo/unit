import {
  camelToKebab,
  camelToSnake,
  getDatumNodeId,
  getExtNodeId,
  getMetadataNodeId,
  getPinIdFromLinkPinNodeId,
  getPinNodeIdFromPinLinkId,
  getUnitIdFromPinLinkId,
  idRegex,
  isDatumNodeId,
  isExternalNodeId,
  isInputPinId,
  isLinkId,
  isLinkPinNodeId,
  isMergeNodeId,
  isMetadataNodeId,
  isOutputPinId,
  isPinNodeId,
  isUnitNodeId,
  kebabToCamel,
  nodeIdRegex,
  segmentDatumNodeId,
  segmentLinkId,
  segmentMergeNodeId,
  segmentMetadataId,
} from '.'
import assert from '../../util/assert'

assert(kebabToCamel('a-b-c') === 'aBC')
assert(kebabToCamel('aBC') === 'aBC')
assert(kebabToCamel('kebab-to-camel') === 'kebabToCamel')
assert(kebabToCamel('kebabToCamel') === 'kebabToCamel')

assert(camelToKebab('aBC') === 'a-b-c')
assert(camelToKebab('kebabToCamel') === 'kebab-to-camel')
assert(camelToKebab('a-b-c') === 'a-b-c')
assert(camelToSnake('aBC') === 'a_b_c')
assert(camelToSnake('kebabToCamel') === 'kebab_to_camel')
assert(camelToSnake('a_b_c') === 'a_b_c')

assert(!!idRegex.exec('a'))
assert(!nodeIdRegex.exec('a/b/c'))
assert(!nodeIdRegex.exec('#a'))
assert(!!nodeIdRegex.exec('a/input/c'))
assert(!!nodeIdRegex.exec('a'))

assert(isMetadataNodeId('$/abcdef/description'))
assert(isMetadataNodeId('$/abcdef/input/fdfdrt/data'))
assert(isMetadataNodeId('$/abcdef/input/a + b/type'))
assert(isMetadataNodeId('$/#/auergl/type'))
// assert(!isMetadataNodeId('$/abcdef/input'))
assert(!isMetadataNodeId('abcdef/data_abcdef'))
assert(!isMetadataNodeId('abcdef'))

assert.equal(getPinIdFromLinkPinNodeId('abc/input/def'), 'def')
assert.equal(getPinIdFromLinkPinNodeId('abc/output/def'), 'def')

assert.equal(isOutputPinId('abc/output/def'), true)
assert.equal(isOutputPinId('abc'), false)

assert(isUnitNodeId('fjjwld'))
assert(!isUnitNodeId('fjjwld/input/data'))

assert(!isUnitNodeId('#bcsrew'))
assert(!isUnitNodeId('%/input/bcsrew'))

assert(isMergeNodeId('@/abcdef'))
assert(isMergeNodeId('@/merge0'))

assert(!isMergeNodeId('abcdef'))
assert(!isMergeNodeId('merge0'))
assert(!isMergeNodeId('%/input/merge0'))

assert.equal(getExtNodeId('input', 'abcdef', 'ghijlm'), '%/input/abcdef/ghijlm')

assert(isExternalNodeId('%/input/abcdef'))
assert(isExternalNodeId('%/output/abcdef'))
assert(isExternalNodeId('%/output/[a]'))
assert(isExternalNodeId('%/input/pjcmihkdo'))

assert(!isExternalNodeId('abcdef'))
assert(!isExternalNodeId('merge0'))
assert(!isExternalNodeId('%/input/#/abcdef'))

assert.deepEqual(segmentMetadataId('?/abcdef/input/a/data'), {
  nodeId: 'abcdef/input/a',
  id: 'data',
})
assert.deepEqual(segmentMergeNodeId('@/abcdef'), {
  id: 'abcdef',
})

assert(isLinkId('length_length/output/length'))

assert.equal(getDatumNodeId('abcdef'), '#/abcdef')

assert.equal(isDatumNodeId('#/abcdef'), true)
assert.equal(isDatumNodeId('#/abcdef/input/a'), true)
assert.equal(isDatumNodeId('#/if/output/a ? b'), true)
assert.equal(isDatumNodeId('abcdef'), false)
assert.equal(isDatumNodeId('#/abcdef_abcdef/input/a'), false)
assert.equal(isDatumNodeId('#/abcdef_abcdef/input/a'), false)

assert.equal(getMetadataNodeId('abcdef', 'description'), '$/abcdef/description')

assert.deepEqual(segmentDatumNodeId('#/abcdef/input/a'), {
  id: 'abcdef/input/a',
})

assert(isLinkPinNodeId('pugej/output/a + b'))
assert(isLinkPinNodeId('pugej/output/a % b'))
assert(isLinkPinNodeId('pugej/output/a'))
assert(isLinkPinNodeId('pugej/input/a'))
assert(!isLinkPinNodeId('%/input/a'))
assert(!isLinkPinNodeId('%/output/a'))

assert(isPinNodeId('pugej/output/a + b'))
assert(isPinNodeId('@/muuja'))

assert(!isPinNodeId('%/input/a'))
assert(!isPinNodeId('%/input/a % b'))

assert.equal(isInputPinId('wewekd/input/poiguy'), true)
assert.equal(
  getPinNodeIdFromPinLinkId('msvsq_mpvsq/output/a'),
  'mpvsq/output/a'
)
assert.equal(getUnitIdFromPinLinkId('msvsq_mpvsq/output/a'), 'msvsq')
assert.deepEqual(segmentLinkId('?/mpvsq/output/a/type_mpvsq/output/a'), {
  source: '?/mpvsq/output/a/type',
  target: 'mpvsq/output/a',
})
