import { $ } from '../Class/$'
import { System } from '../system'
import { F } from '../types/interface/F'

export function wrapFile(file: File, system: System): F & $ {
  const file_ = new (class File_ extends $ implements F {
    __: string[] = ['F']

    raw() {
      return file
    }
  })(system)

  return file_
}
