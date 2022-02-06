import { existsSync } from 'fs'
import { readJSONSync, writeFile } from 'fs-extra'
import * as glob from 'glob'
import * as path from 'path'
import { isNotSymbol } from '../client/event/keyboard/keyCode'
import { GraphSpec } from '../types'
import { removeLastSegment } from '../util/removeLastSegment'

export function sync(dir: string): void {
  let specs = ''
  const _specs = {}

  let ids = ''
  let ids_name_set = new Set<string>()

  let classes = ''
  let classes_import = ''
  let classes_export = 'export default {\n'
  const class_name_set = new Set<string>()

  let components = ''
  let components_import = ''
  let components_export = 'export default {\n'

  const component_name_set = new Set<string>()

  glob
    .sync(`**/**/spec.json`, {
      cwd: dir,
    })
    .map((path) => removeLastSegment(path))
    .forEach((_) => {
      const spec_file_path = `${dir}/${_}/spec.json`
      const spec = readJSONSync(spec_file_path) as GraphSpec
      const segments = _.split('/')
      const l = segments.length
      const tags = segments.slice(0, l - 1)

      spec.system = true
      spec.metadata = spec.metadata || {}
      spec.metadata.tags = tags

      const id = spec.id

      if (!id) {
        console.log(`id not specified at ${spec_file_path}`)
      }

      const { base, name } = spec

      let _name = name
      let i = 0
      while (ids_name_set.has(_name)) {
        _name = name + ' ' + i
        i++
      }
      ids_name_set.add(_name)

      const NAME = _name
        .split('')
        .filter(isNotSymbol)
        .join('')
        .toUpperCase()
        .split(' ')
        .join('_')

      ids += `export const ID_${NAME} = '${id}'\n`

      _specs[id] = spec

      let name_init = segments[l - 1]

      const class_file_path = `${dir}/${_}/index.ts`
      if (existsSync(class_file_path)) {
        let name = name_init
        let i = 0
        while (class_name_set.has(name)) {
          name = name_init + i
          i++
        }
        class_name_set.add(name)

        classes_import += `import ${name} from './${_}'\n`
        classes_export += `\t'${id}': ${name},\n`
      }

      const component_file_path = `${dir}/${_}/Component.ts`
      if (existsSync(component_file_path)) {
        let name = name_init
        let i = 0
        while (component_name_set.has(name)) {
          name = name_init + i
          i++
        }
        component_name_set.add(name)
        components_import += `import ${name} from './${_}/Component'\n`
        components_export += `\t'${id}': ${name},\n`
      }
    })

  classes_export += '}'

  components_export += '}'
  components = components_import + '\n' + components_export

  classes = classes_import + '\n' + classes_export

  specs = `export default JSON.parse(\`${JSON.stringify(_specs)
    .replace(/\\/g, '\\\\')
    .replace(/\`/g, '\\`')
    .replace(/\$/g, '\\$')}\`)\n`

  writeFile(path.join(dir, '_ids.ts'), ids)
  writeFile(path.join(dir, '_classes.ts'), classes)
  writeFile(path.join(dir, '_components.ts'), components)
  writeFile(path.join(dir, '_specs.ts'), specs)
}
