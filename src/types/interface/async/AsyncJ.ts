import { $ } from '../../../Class/$'
import { ObjectUpdateType } from '../../../ObjectUpdateType'
import { evaluate } from '../../../spec/evaluate'
import { Callback } from '../../Callback'
import { J } from '../J'
import { $J, $J_C, $J_G, $J_R, $J_W } from './$J'
import { Async } from './Async'

export const AsyncJGet: (value: J) => $J_G = (value) => {
  const $get: $J_G = {
    $get({ name }: { name: string }, callback: Callback<any>): void {
      let data: any

      try {
        data = value.get(name)
      } catch (err) {
        callback(undefined, err.message)

        return
      }

      callback(data)
    },
    $deepGet: function (
      { path }: { path: string[] },
      callback: Callback<any>
    ): void {
      let data: any

      try {
        data = value.deepGet(path)
      } catch (err) {
        callback(undefined, err.message)

        return
      }

      callback(data)
    },
    $hasKey: function (
      { name }: { name: string },
      callback: Callback<boolean>
    ): void {
      let data: any

      try {
        data = value.hasKey(name)
      } catch (err) {
        callback(undefined, err.message)

        return
      }

      callback(data)
    },
    $keys: function ({}: {}, callback: Callback<string[]>): void {
      let data: any

      try {
        data = value.keys()
      } catch (err) {
        callback(undefined, err.message)

        return
      }

      callback(data)
    },
    $deepHas: function (
      { path }: { path: string[] },
      callback: Callback<boolean>
    ): void {
      let data: any

      try {
        data = value.deepHas(path)
      } catch (err) {
        callback(undefined, err.message)

        return
      }

      callback(data)
    },
  }

  return $get
}

export const AsyncJCall: (value: J) => $J_C = (value) => {
  const $call: $J_C = {
    $set(
      { name, data }: { name: string; data: string },
      callback: Callback<any>
    ): void {
      try {
        const _data = evaluate(data, {}, {})

        value.set(name, _data)
      } catch (err) {
        callback(undefined, err.message)

        return
      }

      callback()
    },
    $delete: function (
      { name }: { name: string },
      callback: Callback<any>
    ): void {
      try {
        value.delete(name)
      } catch (err) {
        callback(undefined, err.message)

        return
      }

      callback()
    },
    $deepSet: function (
      { path, data }: { name: string; path: string[]; data: any },
      callback: Callback<any>
    ): void {
      try {
        value.deepSet(path, data)
      } catch (err) {
        callback(undefined, err.message)

        return
      }

      callback()
    },
    $deepDelete: function (
      { path }: { name: string; path: string[] },
      callback: Callback<any>
    ): void {
      try {
        value.deepDelete(path)
      } catch (err) {
        callback(undefined, err.message)

        return
      }

      callback()
    },
  }

  return $call
}

export const AsyncJWatch: (value: J) => $J_W = (value) => {
  const $watch: $J_W = {
    $subscribe: function (
      { key, path }: { path: string[]; key: string },
      callback: Callback<{
        type: ObjectUpdateType
        path: string[]
        key: string
        data: any
      }>
    ): void {
      try {
        value.subscribe(path, key, (type, path, key, data) => {
          callback({
            type,
            path,
            key,
            data,
          })
        })
      } catch (err) {
        callback(undefined, err.message)

        return
      }
    },
  }

  return $watch
}

export const AsyncJRef: (value: J) => $J_R = (value) => {
  return {
    $ref({ name }: { name: string }): any {
      let obj: any

      try {
        obj = value.get(name)
      } catch (err) {
        return null
      }

      if (obj === undefined) {
        return null
      }

      if (obj instanceof $) {
        const $obj = Async(obj, obj.__, obj.__system.async)

        return $obj
      } else {
        return null
      }
    },
  }
}

export const AsyncJ: (value: J) => $J = (value: J) => {
  return {
    ...AsyncJGet(value),
    ...AsyncJCall(value),
    ...AsyncJWatch(value),
    ...AsyncJRef(value),
  }
}
