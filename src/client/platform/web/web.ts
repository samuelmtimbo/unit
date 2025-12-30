import { BootOpt } from '../../../system'
import { BundleSpec } from '../../../types/BundleSpec'
import { SYSTEM_BOOT_ID } from '../../constants/SYSTEM_BOOT_ID'
import { SYSTEM_BUNDLE_ID } from '../../constants/SYSTEM_BUNDLE_ID'
import { render } from './render'

function objFromElement(id: string): object {
  let obj: object = {}

  const jsonElement = document.getElementById(id)

  if (jsonElement) {
    const json = jsonElement.textContent

    try {
      obj = JSON.parse(json)
    } catch (err) {
      //
    }
  }

  return obj
}

const bundle: BundleSpec = objFromElement(SYSTEM_BUNDLE_ID)
const system: BootOpt = objFromElement(SYSTEM_BOOT_ID)

render(bundle, system)
