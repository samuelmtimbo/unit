import assert from 'assert'
import { SharedObject } from '../SharedObject'
import { countEvent } from './util'

class Counter {
  private _data: number

  constructor(init: number) {
    this._data = init
  }

  inc() {
    this._data++
  }

  dec() {
    this._data--
  }
}

const counter = new Counter(0)

const shared_counter = new SharedObject(counter)

const client0 = shared_counter.connect()
const client1 = shared_counter.connect()
const client2 = shared_counter.connect()

const { proxy: proxy0, emitter: emitter0, disconnect: disconnect0 } = client0
const { proxy: proxy1, emitter: emitter1, disconnect: disconnect1 } = client1
const { proxy: proxy2, emitter: emitter2, disconnect: disconnect2 } = client2

const incCounter0 = countEvent(emitter0, 'inc')
const incCounter1 = countEvent(emitter1, 'inc')
const incCounter2 = countEvent(emitter2, 'inc')

proxy0.inc()

assert.equal(incCounter0.count, 0)
assert.equal(incCounter1.count, 1)
assert.equal(incCounter2.count, 1)

proxy1.inc()

assert.equal(incCounter0.count, 1)
assert.equal(incCounter1.count, 1)
assert.equal(incCounter2.count, 2)

disconnect2()

proxy1.inc()

assert.equal(incCounter0.count, 2)
assert.equal(incCounter1.count, 1)
assert.equal(incCounter2.count, 2)
