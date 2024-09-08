import { tryCatch } from '../../../util/err'
import { Callback } from '../../Callback'
import { A } from '../A'
import { $A, $A_C, $A_G, $A_R, $A_W } from './$A'

export const AsyncAGet = (array: A): $A_G => ({
  $at: function ({ i }: { i: number }, callback: Callback<any>): void {
    tryCatch(() => array.at(i), callback)
  },
  $length: function ({}: {}, callback: Callback<number>): void {
    tryCatch(() => array.length(), callback)
  },
  $indexOf: function ({ a }: { a: any }, callback: Callback<number>): void {
    tryCatch(() => array.indexOf(a), callback)
  },
})

export const AsyncACall = (array: A): $A_C => ({
  $append: function ({ a }: { a: any }, callback: Callback<void>): void {
    tryCatch(() => array.append(a), callback)
  },
  $put: function (
    { i, data }: { i: number; data: any },
    callback: Callback<any>
  ): void {
    tryCatch(() => array.put(data, i), callback)
  },
})

export const AsyncAWatch = (array: A): $A_W => {
  return {}
}

export const AsyncARef = (array: A): $A_R => ({})

export const AsyncA = (array: A): $A => {
  return {
    ...AsyncAGet(array),
    ...AsyncACall(array),
    ...AsyncAWatch(array),
    ...AsyncARef(array),
  }
}
