import { API } from '../../../../API'
import { APINotSupportedError } from '../../../../exception/APINotImplementedError'
import { BootOpt } from '../../../../system'

export function webCrypto(window: Window, opt: BootOpt): API['crypto'] {
  const crypto: API['crypto'] = {
    generateKey: function (
      algorithm: AlgorithmIdentifier,
      extractable: boolean,
      keyUsages: KeyUsage[]
    ): Promise<CryptoKey | CryptoKeyPair> {
      if (window.crypto) {
        return window.crypto.subtle.generateKey(
          algorithm,
          extractable,
          keyUsages
        )
      }

      throw new APINotSupportedError('Crypto')
    },
    exportKey: function (
      format: KeyFormat,
      key: CryptoKey
    ): Promise<ArrayBuffer | JsonWebKey> {
      if (window.crypto) {
        return window.crypto.subtle.exportKey(format, key)
      }

      throw new APINotSupportedError('Crypto')
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
      if (window.crypto) {
        return window.crypto.subtle.importKey(
          format as any,
          key as any,
          algorithm,
          extractable,
          keyUsages
        )
      }

      throw new APINotSupportedError('Crypto')
    },
    encrypt: function (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      data: BufferSource
    ): Promise<ArrayBuffer> {
      if (window.crypto) {
        return window.crypto.subtle.encrypt(algorithm, key, data)
      }

      throw new APINotSupportedError('Crypto')
    },
    decrypt: function (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      data: BufferSource
    ): Promise<ArrayBuffer> {
      if (window.crypto) {
        return window.crypto.subtle.decrypt(algorithm, key, data)
      }

      throw new APINotSupportedError('Crypto')
    },
    sign: function (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      data: ArrayBuffer
    ): Promise<ArrayBuffer> {
      if (window.crypto) {
        return window.crypto.subtle.sign(algorithm, key, data)
      }

      throw new APINotSupportedError('Crypto')
    },
    verify: function (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      signature: BufferSource,
      data: BufferSource
    ): Promise<boolean> {
      if (window.crypto) {
        return window.crypto.subtle.verify(algorithm, key, signature, data)
      }

      throw new APINotSupportedError('Crypto')
    },
  }

  return crypto
}
