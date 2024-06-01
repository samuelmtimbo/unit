import Sort from '../../../../system/f/array/Sort'
import assert from '../../../../util/assert'
import { system } from '../../../util/system'

const sort = new Sort(system)

sort.play()

let i: boolean = undefined
let j: boolean = undefined

let p = () => {
  if (i !== undefined && j !== undefined) {
    i = undefined
    j = undefined

    sort.push('a[i] < a[j]', sort.peak('a[i]') < sort.peak('a[j]'))

    sort.take('a[i]')
    sort.take('a[j]')
  }
}

sort.getOutput('a[i]').addListener('data', (data) => {
  i = data

  p()
})

sort.getOutput('a[j]').addListener('data', (data) => {
  j = data

  p()
})

sort.getOutput('b').addListener('data', (data) => {
  assert.deepEqual(sort.take('b'), [1, 2, 3])
})

sort.push('a', [3, 2, 1])
