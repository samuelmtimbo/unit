import { System } from '../../system'
import { BundleSpec } from '../../types/BundleSpec'
import webRender from '../platform/web/render'

declare global {
  interface Window {
    system: System

    FileSystemFileHandle: any
  }
}

let bundle: BundleSpec = {}

const bundle_element = window.document.getElementById('__SYSTEM__BUNDLE__')

if (bundle_element) {
  const bundle_element_text = bundle_element.innerText

  bundle = JSON.parse(bundle_element_text)
}

const [graph, system, unlisten] = webRender(bundle)

window.onbeforeunload = () => {
  console.log('onbeforeunload')

  unlisten()
}

window.system = system
