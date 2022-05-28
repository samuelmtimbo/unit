import { API } from '../../../../system'
import { Storage_ } from '../../../../system/platform/api/storage/Storage_'

export function webStorage(window: Window, prefix: string): API['storage'] {
  const storage = {
    local: () => new Storage_(localStorage),
    session: () => new Storage_(sessionStorage),
  }

  return storage
}
