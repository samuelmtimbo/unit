import { RemotePort } from './RemotePort'
import { METHOD } from './client/method'
import { ALL_TYPES_MAP } from './interface'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import { Unlisten } from './types/Unlisten'
import { $U } from './types/interface/async/$U'
import { AsyncWrap } from './types/interface/async/AsyncWrap'
import { mapObjKV } from './util/object'

export const ASYNC_WORKER: Dict<(client: RemotePort) => any> = mapObjKV(
  ALL_TYPES_MAP,
  (_) => (client: RemotePort) => {
    const { get, call, watch, ref } = METHOD[_]

    return {
      ...makeAsyncWorkerG(client, get),
      ...makeAsyncWorkerC(client, call),
      ...makeAsyncWorkerW(client, watch),
      ...makeAsyncWorkerR(client, ref),
    }
  }
)

export function AsyncWorker(client: RemotePort, _: string[]): any {
  return AsyncWrap(client, _, ASYNC_WORKER)
}

export function makeAsyncWorkerG(
  client: RemotePort,
  METHOD_GET: string[]
): any {
  const _$_G = {}
  for (const name of METHOD_GET) {
    const $name = `$${name}`
    _$_G[$name] = (data: any, callback: Callback<any>): void => {
      return client.get($name, data, callback)
    }
  }
  return _$_G
}

export function makeAsyncWorkerC(
  client: RemotePort,
  METHOD_CALL: string[]
): any {
  const _$_C = {}
  for (const name of METHOD_CALL) {
    const $name = `$${name}`
    _$_C[$name] = (data: any, callback: Callback<any>): void => {
      return client.call($name, data, callback)
    }
  }
  return _$_C
}

export function makeAsyncWorkerW(
  client: RemotePort,
  METHOD_WATCH: string[]
): any {
  const _$_W = {}
  for (const name of METHOD_WATCH) {
    const $name = `$${name}`
    _$_W[$name] = (data: any, callback: Callback<any>): Unlisten => {
      const unlisten = client.watch($name, data, callback)
      return unlisten
    }
  }
  return _$_W
}

export function makeAsyncWorkerR(
  client: RemotePort,
  METHOD_REF: string[]
): any {
  const _$_R = {}
  for (const name of METHOD_REF) {
    const $name = `$${name}`
    _$_R[$name] = (data: any): $U => {
      const { _ } = data
      const ref_client = client.ref($name, data)
      const $ref = AsyncWorker(ref_client, _)
      return $ref
    }
  }
  return _$_R
}
