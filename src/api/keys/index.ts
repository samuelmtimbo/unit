import { storageHasKey } from '../../client/util/web/storage'
import { APINotSupportedError } from '../../exception/APINotImplementedError'
import { System } from '../../system'

export const LOCAL_STORAGE_PREFIX_PUBLIC_KEY =
  '__LOCAL__STORAGE__PREFIX__PUBLIC__KEY__'
export const LOCAL_STORAGE_PREFIX_PRIVATE_KEY =
  '__LOCAL__STORAGE__PREFIX__PRIVATE__KEY__'

export const _public_key_list: string[] = []
export const _private_key_list: string[] = []

let init = false
let last = -1

export async function getPublicKeyList($system: System): Promise<string[]> {
  if (!init) {
    let i = 0
    let key

    while (true) {
      key = `${LOCAL_STORAGE_PREFIX_PUBLIC_KEY}${i}`

      if (storageHasKey(localStorage, key)) {
        const public_key = localStorage.getItem(key)
        _public_key_list.push(public_key)
      } else {
        last = i - 1
        break
      }

      i++
    }

    init = true
  }

  // AD HOC
  while (_public_key_list.length < 3) {
    await newPublicKey($system)
  }

  return _public_key_list
}

export async function newPublicKey($system: System): Promise<string> {
  const {
    api: {
      storage: { local },
    },
  } = $system

  const localStorage = local(undefined)

  if (!localStorage) {
    throw new APINotSupportedError('Local Storage')
  }

  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  )

  const { publicKey, privateKey } = keyPair

  // console.log('publicKey', publicKey)
  // console.log('privateKey', privateKey)

  const publicKeyJWK = await crypto.subtle.exportKey('jwk', publicKey)
  const privateKeyJWK = await crypto.subtle.exportKey('jwk', privateKey)

  // console.log('publicKeyJWK', publicKeyJWK)
  // console.log('privateKeyJWK', privateKeyJWK)

  const publicKeyJWKJSON = JSON.stringify(publicKeyJWK)
  const privateKeyJWKJSON = JSON.stringify(privateKeyJWK)

  const publicKeyJWKJSON64 = btoa(publicKeyJWKJSON)
  const privateKeyJWKJSON64 = btoa(privateKeyJWKJSON)

  // console.log('publicKeyJWKJSON64', publicKeyJWKJSON64)
  // console.log('privateKeyJWKJSON64', privateKeyJWKJSON64)

  localStorage.set(
    `${LOCAL_STORAGE_PREFIX_PUBLIC_KEY}${last + 1}`,
    publicKeyJWKJSON64
  )
  localStorage.set(
    `${LOCAL_STORAGE_PREFIX_PRIVATE_KEY}${last + 1}`,
    privateKeyJWKJSON64
  )

  _public_key_list.push(publicKeyJWKJSON)
  _private_key_list.push(privateKeyJWKJSON)

  return publicKeyJWKJSON
}
