import assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromBundle } from '../../../spec/fromBundle'
import _specs from '../../../system/_specs'
import { countEvent } from '../../util'
import { system } from '../../util/system'

const bundle = require('./MergeSort.json')

const MergeSort = fromBundle(bundle, _specs, {})

const mergeSort = new MergeSort(system)

const dataCounter = countEvent(mergeSort.getOutput('a'), 'data')
const dropCounter = countEvent(mergeSort.getOutput('a'), 'drop')

false && watchUnitAndLog(mergeSort)
false && watchGraphAndLog(mergeSort)

mergeSort.play()

mergeSort.push('a', [])
assert.deepEqual(mergeSort.take('a'), [])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

mergeSort.push('a', [0])
assert.deepEqual(mergeSort.take('a'), [0])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

mergeSort.push('a', [2, 1])
assert.deepEqual(mergeSort.take('a'), [1, 2])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

mergeSort.push('a', [1, 2, 3])
assert.deepEqual(mergeSort.take('a'), [1, 2, 3])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

mergeSort.push('a', [2, 1, 3])
assert.deepEqual(mergeSort.take('a'), [1, 2, 3])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

mergeSort.push('a', [9, 8, 7, 6, 5, 4, 3, 2, 1])
assert.deepEqual(mergeSort.take('a'), [1, 2, 3, 4, 5, 6, 7, 8, 9])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

dataCounter.reset()
dropCounter.reset()
mergeSort.push('a', [0])
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.deepEqual(mergeSort.peak('a'), [0])
assert.deepEqual(mergeSort.takeInput('a'), [0])
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 1)
assert.deepEqual(mergeSort.peakInput('a'), undefined)
assert.deepEqual(mergeSort.take('a'), undefined)

dataCounter.reset()
dropCounter.reset()

mergeSort.push('a', [1, 0])
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
assert.deepEqual(mergeSort.peak('a'), [0, 1])
assert.deepEqual(mergeSort.takeInput('a'), [1, 0])
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 1)
assert.deepEqual(mergeSort.peakInput('a'), undefined)
assert.deepEqual(mergeSort.take('a'), undefined)

mergeSort.push('a', [])
assert.deepEqual(mergeSort.peak('a'), [])
mergeSort.push('a', [1, 0])
assert.deepEqual(mergeSort.take('a'), [0, 1])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

dataCounter.reset()
dropCounter.reset()
mergeSort.push('a', [])
assert.equal(dataCounter.count, 1)
assert.equal(dropCounter.count, 0)
mergeSort.push('a', [1, 0])
assert.equal(dataCounter.count, 2)
assert.equal(dropCounter.count, 0)
mergeSort.push('a', [])
assert.equal(dataCounter.count, 3)
assert.equal(dropCounter.count, 0)
mergeSort.push('a', [1, 0])
assert.equal(dataCounter.count, 4)
assert.equal(dropCounter.count, 0)
mergeSort.push('a', [])
assert.equal(dataCounter.count, 5)
assert.equal(dropCounter.count, 0)
mergeSort.push('a', [1, 0])
assert.equal(dataCounter.count, 6)
assert.equal(dropCounter.count, 0)
assert.deepEqual(mergeSort.take('a'), [0, 1])
assert.equal(dataCounter.count, 6)
assert.equal(dropCounter.count, 1)
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

mergeSort.push('a', [0])
assert.deepEqual(mergeSort.peak('a'), [0])
mergeSort.push('a', [1, 0])
assert.deepEqual(mergeSort.take('a'), [0, 1])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

mergeSort.push('a', [1, 0])
assert.deepEqual(mergeSort.peak('a'), [0, 1])
mergeSort.push('a', [0])
assert.deepEqual(mergeSort.take('a'), [0])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

mergeSort.push('a', [])
assert.deepEqual(mergeSort.peak('a'), [])
mergeSort.push('a', [9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
assert.deepEqual(mergeSort.take('a'), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

mergeSort.push('a', [3, 2, 1])
mergeSort.push('a', [2, 1])
assert.deepEqual(mergeSort.take('a'), [1, 2])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

mergeSort.push('a', [5, 4, 3, 2, 1, 0])
assert.deepEqual(mergeSort.peak('a'), [0, 1, 2, 3, 4, 5])
mergeSort.push('a', [11, 10, 9, 8, 7, 6])
assert.deepEqual(mergeSort.take('a'), [6, 7, 8, 9, 10, 11])
assert.deepEqual(mergeSort.take('a'), undefined)
assert.deepEqual(mergeSort.peakInput('a'), undefined)

// // should not exceed maximum call stack size

// mergeSort.push('a', rangeArray(100))
// assert.deepEqual(mergeSort.take('a'), rangeArray(100))

// // infinite loop
// mergeSort.setInputConstant('a', true)
// mergeSort.setOutputIgnored('a', true)
// mergeSort.push('a', [3, 2, 1])

// function _mergeSort(a: number[]): number[] {
//   const l = a.length
//   if (a.length > 1) {
//     const a0 = a.slice(0, l / 2)
//     const a1 = a.slice(l / 2, l)
//     const sort_a0 = _mergeSort(a0)
//     const sort_a1 = _mergeSort(a1)
//     // return _recPriorityMerge(sort_a0, sort_a1)
//     return _priorityMerge(sort_a0, sort_a1)
//   }
//   return a
// }

// function _recPriorityMerge(a: number[], b: number[]): number[] {
//   return _recPriorityMergeFrom(a, b, [])
// }

// function _recPriorityMergeFrom(
//   a: number[],
//   b: number[],
//   from: number[]
// ): number[] {
//   const al = a.length
//   const bl = b.length
//   if (al === 0 && bl === 0) {
//     return from
//   } else if (al === 0) {
//     return _recPriorityMergeFrom(a, b.slice(1, bl), [...from, b[0]])
//   } else if (bl === 0) {
//     return _recPriorityMergeFrom(a.slice(1, al), b, [...from, a[0]])
//   } else {
//     if (a[0] < b[0]) {
//       return _recPriorityMergeFrom(a.slice(1, al), b, [...from, a[0]])
//     } else {
//       return _recPriorityMergeFrom(a, b.slice(1, bl), [...from, b[0]])
//     }
//   }
// }

// function _priorityMerge(a: number[], b: number[]): number[] {
//   const result: number[] = []
//   let i = 0
//   let j = 0
//   const al = a.length
//   const bl = b.length
//   while (i < al || j < bl) {
//     if (i < al && j < bl) {
//       if (a[i] < b[j]) {
//         result.push(a[i])
//         i++
//       } else {
//         result.push(b[j])
//         j++
//       }
//     } else if (i < al) {
//       result.push(a[i])
//       i++
//     } else if (j < bl) {
//       result.push(b[j])
//       j++
//     }
//   }
//   return result
// }

// // console.log(_mergeSort(rangeArray(10000)))
