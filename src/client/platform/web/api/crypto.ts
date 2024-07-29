import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { BootOpt } from '../../../../system'

export function webCrypto(window: Window, opt: BootOpt): API['crypto'] {
  const check = () => {
    if (!window.crypto) {
      throw new APINotSupportedError('Crypto')
    }
  }

  const crypto: API['crypto'] = {
    generateKey: function (
      algorithm: AlgorithmIdentifier,
      extractable: boolean,
      keyUsages: KeyUsage[]
    ): Promise<CryptoKey | CryptoKeyPair> {
      check()

      return window.crypto.subtle.generateKey(algorithm, extractable, keyUsages)
    },
    exportKey: function (
      format: KeyFormat,
      key: CryptoKey
    ): Promise<ArrayBuffer | JsonWebKey> {
      check()

      return window.crypto.subtle.exportKey(format, key)
    },
    importKey: function <
      F extends KeyFormat,
      K extends F extends 'jwk' ? JsonWebKey : BufferSource,
    >(
      format: F,
      key: K,
      algorithm: AlgorithmIdentifier,
      extractable: boolean,
      keyUsages: KeyUsage[]
    ): Promise<CryptoKey> {
      check()

      return window.crypto.subtle.importKey(
        format as any,
        key as any,
        algorithm,
        extractable,
        keyUsages
      )
    },
    encrypt: function (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      data: BufferSource
    ): Promise<ArrayBuffer> {
      check()

      return window.crypto.subtle.encrypt(algorithm, key, data)
    },
    decrypt: function (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      data: BufferSource
    ): Promise<ArrayBuffer> {
      check()

      return window.crypto.subtle.decrypt(algorithm, key, data)
    },
    sign: function (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      data: ArrayBuffer
    ): Promise<ArrayBuffer> {
      check()

      return window.crypto.subtle.sign(algorithm, key, data)
    },
    verify: function (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      signature: BufferSource,
      data: BufferSource
    ): Promise<boolean> {
      check()

      return window.crypto.subtle.verify(algorithm, key, signature, data)
    },
  }

  return crypto
}
