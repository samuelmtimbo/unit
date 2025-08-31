import { boot } from '../client/platform/node/boot'
import { fromBundle } from '../spec/fromBundle'
import _specs from '../system/_specs'

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
