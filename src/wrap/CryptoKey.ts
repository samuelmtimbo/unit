import { $ } from '../Class/$'
import { System } from '../system'
import { CK } from '../types/interface/CK'

export function wrapCryptoKey(
  cryptoKey: CryptoKey | CryptoKeyPair,
  system: System
): CK & $ {
  const stream = new (class Stream extends $ implements CK {
    __: string[] = ['CK']

    raw() {
      return cryptoKey
    }
  })(system)

  return stream
}
