import { existsSync } from 'fs'
import { ensureDir, readJSONSync, writeFile } from 'fs-extra'
import * as glob from 'glob'
import * as path from 'path'
import { isNotSymbol } from '../client/event/keyboard/key'
import { GraphSpec } from '../types/GraphSpec'
import { removeLastSegment } from '../util/removeLastSegment'

/* eslint-disable no-console */

export async function sync(
  systemDir: string,
  outputDir: string,
  specIdWhitelist?: Set<string>
): Promise<void> {
  const { specs, ids, classes, components } = rawSync(
    systemDir,
    specIdWhitelist
  )

  await ensureDir(outputDir)

  await Promise.all([
    writeFile(path.join(outputDir, '_ids.ts'), ids),
    writeFile(path.join(outputDir, '_classes.ts'), classes),
    writeFile(path.join(outputDir, '_components.ts'), components),
    writeFile(path.join(outputDir, '_specs.ts'), specs),
  ])
}

export function rawSync(
  dir: string,
  idSet?: Set<string>
): { specs: string; classes: string; components: string; ids: string } {
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

      const id = spec.id

      if (!id) {
        console.log(`id not specified at ${spec_file_path}`)
      }

      spec.system = true
      spec.metadata = spec.metadata || {}
      spec.metadata.tags = tags

      const { base, name } = spec

      let _name = name
      let i = 0
      while (ids_name_set.has(_name)) {
        _name = name + ' ' + i
        i++
      }
      ids_name_set.add(_name)

      if (idSet && !idSet.has(id)) {
        return
      }

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
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')}\`)\n`

  return { specs, classes, components, ids }
}
