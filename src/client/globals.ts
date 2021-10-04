import __classes from '../system/_classes'
import __components from '../system/_components'
import __specs from '../system/_specs'

export default () => {
  globalThis.__specs = __specs
  globalThis.__classes = __classes
  globalThis.__components = __components
}
