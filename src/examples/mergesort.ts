import { boot } from '@_unit/unit/client/platform/node/boot'
import { fromBundle } from '@_unit/unit/spec/fromBundle'
import _specs from '@_unit/unit/system/_specs'

export const [system] = boot()

const bundle = require('./MergeSort.json')

const MergeSort = fromBundle(bundle, _specs, {})

const graph = new MergeSort(system)

graph.play()

graph.push('a', [2, 1])

console.log(graph.take('a')) // [1, 2]

graph.getOutput('a').addListener('data', (data) => {
  console.log(data)
})

graph.push('a', [3, 2, 1, 0])
graph.push('a', [1, 2, 0, 3])
