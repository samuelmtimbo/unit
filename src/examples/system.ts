import { boot } from '@_unit/unit/lib/client/platform/node/boot'
import { fromBundle } from '@_unit/unit/lib/spec/fromBundle'
import _specs from '@_unit/unit/lib/system/_specs'

export const system = boot()

const bundle = require('./MergeSort.json')

const MergeSort = fromBundle(bundle, _specs, {})

const mergeSort = new MergeSort(system)

mergeSort.play()

mergeSort.push('a', [2, 1])

console.log(mergeSort.take('a')) // [1, 2]
