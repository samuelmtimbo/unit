import assert from 'assert'
import { Unit } from '../Class/Unit'
import { EventEmitter_ } from '../EventEmitter'
import { MIMO } from '../MIMO'
import { Pin, PinEvent } from '../Pin'
import { Dict } from '../types/Dict'

export function testMIMO(
  unit: MIMO<any, any>,
  input: Dict<any>,
  output: Dict<any>
) {
  unit.pushAll(input)
  assert.deepEqual(unit.takeAll(), output)
}

export function testSISO(
  unit: Unit<any, any>,
  inputName: string,
  input: any,
  outputName: string,
  output: any
) {
  unit.push(inputName, input)
  assert.deepEqual(unit.peak(outputName), output)
}

export type EventCounter = {
  count: number
  remove: () => void
  reset: () => void
}

export function countEvent(
  emitter: EventEmitter_,
  event: string,
  callback?: (count: number) => void
): EventCounter {
  const eventCounter: EventCounter = {
    count: 0,
    remove: () => {
      emitter.removeListener(event, listener)
    },
    reset: () => {
      eventCounter.count = 0
    },
  }
  const listener = () => {
    eventCounter.count++
    callback && callback(eventCounter.count)
  }
  emitter.addListener(event, listener)
  return eventCounter
}

export function callAfterCount(
  pin: Pin<any>,
  event: PinEvent,
  max: number = 1000,
  callback: () => void
): EventCounter {
  const eventCounter = countEvent(pin, event, (count: number) => {
    if (count >= max) {
      callback()
    }
  })
  return eventCounter
}
