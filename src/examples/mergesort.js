const { boot } = require('../../lib/client/platform/node/boot.js')
const { fromBundle } = require('../../lib/spec/fromBundle.js')
const fs = require('fs')
const path = require('path')
const _specs = require('../../lib/system/_specs.js').default

const system = boot()

const bundle = JSON.parse(
  fs.readFileSync(path.join(__dirname, './MergeSort.json'), 'utf8')
)

const MergeSort = fromBundle(bundle, _specs, {})

const mergeSort = new MergeSort(system)

mergeSort.play()

mergeSort.push('a', [2, 1])

console.log(mergeSort.take('a')) // [1, 2]
