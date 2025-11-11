const { boot } = require('@_unit/unit/client/platform/node/boot')
const { fromBundle } = require('@_unit/unit/spec/fromBundle')
const fs = require('fs')
const path = require('path')
const _specs = require('@_unit/unit/system/_specs').default

const [system] = boot()

const bundle = JSON.parse(
  fs.readFileSync(path.join(__dirname, './MergeSort.json'), 'utf8')
)

const MergeSort = fromBundle(bundle, _specs, {})

const mergeSort = new MergeSort(system)

mergeSort.play()

mergeSort.push('a', [2, 1])

console.log(mergeSort.take('a')) // [1, 2]
