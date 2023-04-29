import { BundleSpec } from '../../types/BundleSpec'
import webRender from '../platform/web/render'

let bundle: BundleSpec = {}

const bundle_element = window.document.getElementById('__SYSTEM__BUNDLE__')

if (bundle_element) {
  const bundle_element_text = bundle_element.innerText

  bundle = JSON.parse(bundle_element_text)
} else {
  console.error('No bundle found.')
}

webRender(bundle)
