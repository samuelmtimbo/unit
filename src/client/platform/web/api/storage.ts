import { API, BootOpt } from '../../../../system'
import { Storage_ } from '../../../../system/platform/api/storage/Storage_'

export function webStorage(window: Window, opt: BootOpt): API['storage'] {
  const storage = {
    local: () => new Storage_(localStorage),
    session: () => new Storage_(sessionStorage),
  }

  return storage
}
