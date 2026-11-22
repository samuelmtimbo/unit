import { existsSync, readdirSync, readFileSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import * as path from 'path'
import { isNotSymbol } from '../client/event/keyboard/key'
import { Spec } from '../types'
import { Dict } from '../types/Dict'
import { GraphSpec } from '../types/GraphSpec'

/* eslint-disable no-console */

function readJSONSync<T>(filePath: string): T {
  return JSON.parse(readFileSync(filePath, 'utf8'))
}

function findSpecDirs(systemDir: string): string[] {
  return readdirSync(systemDir, { recursive: true, encoding: 'utf8' })
    .filter((file) => path.basename(file) === 'spec.json')
    .map((file) => path.dirname(file))
}

function syncSystem(systemDir: string): {
  system_specs: Dict<Spec>
  system_ids_name_set: Set<string>
  system_id_to_name: Dict<string>
  system_id_to_folder_path: Dict<string>
} {
  const system_specs: Dict<Spec> = {}
  const system_ids_name_set = new Set<string>()
  const system_id_to_name: Dict<string> = {}
  const system_id_to_folder_path: Dict<string> = {}

  for (const dir of findSpecDirs(systemDir)) {
    const folder_path = path.join(systemDir, dir)
    const spec_file_path = path.join(folder_path, 'spec.json')
    const spec = readJSONSync<GraphSpec>(spec_file_path)

    system_specs[spec.id] = spec

    const { name } = spec

    let _name = name
    let i = 0

    while (system_ids_name_set.has(_name)) {
      _name = name + ' ' + i
      i++
    }

    system_ids_name_set.add(_name)
    system_id_to_name[spec.id] = _name
    system_id_to_folder_path[spec.id] = folder_path
  }

  return {
    system_specs,
    system_id_to_name,
    system_ids_name_set,
    system_id_to_folder_path,
  }
}

export async function sync(
  systemDir: string,
  outputDir: string,
  specIdWhitelist?: Set<string>
): Promise<void> {
  const { specs, ids, classes, components } = rawSync(
    systemDir,
    specIdWhitelist
  )

  await mkdir(outputDir, { recursive: true })

  await Promise.all([
    writeFile(path.join(outputDir, '_ids.ts'), ids),
    writeFile(path.join(outputDir, '_classes.ts'), classes),
    writeFile(path.join(outputDir, '_components.ts'), components),
    writeFile(path.join(outputDir, '_specs.ts'), specs),
  ])
}

export function rawSync(
  systemDir: string,
  specIdWhitelist?: Set<string>
): { specs: string; classes: string; components: string; ids: string } {
  const {
    system_specs,
    system_id_to_name,
    system_ids_name_set,
    system_id_to_folder_path,
  } = syncSystem(systemDir)

  const _specs: Dict<Spec> = {}

  let specs = ''
  let ids = ''

  let classes = ''
  let classes_import = ''
  let classes_export = 'export default {\n'

  let components = ''
  let components_import = ''
  let components_export = 'export default {\n'

  const class_name_set = new Set<string>()
  const component_name_set = new Set<string>()

  const ids_name_set = new Set(system_ids_name_set)
  const ids_visited = new Set<string>()
  const id_to_name = { ...system_id_to_name }

  for (const dir of findSpecDirs(systemDir)) {
    const folder_path = path.join(systemDir, dir)
    const spec_file_path = path.join(folder_path, 'spec.json')
    const spec = readJSONSync<GraphSpec>(spec_file_path)

    const segments = dir === '.' ? [] : dir.split(path.sep)
    const l = segments.length
    const tags = segments.slice(0, l - 1)

    const id = spec.id

    spec.metadata = spec.metadata || {}
    spec.metadata.tags = tags

    if (!id) {
      console.log(`id not specified at ${spec_file_path}`)
    }

    if (specIdWhitelist && !specIdWhitelist.has(id)) {
      continue
    }

    const include = (id: string, spec: Spec, spec_folder_path: string) => {
      if (ids_visited.has(id)) {
        return
      }

      ids_visited.add(id)

      spec.system = true

      const { name } = spec

      let _name = id_to_name[id]

      if (!_name) {
        let i = 0

        while (ids_name_set.has(_name)) {
          _name = name + ' ' + i
          i++
        }

        ids_name_set.add(_name)
        id_to_name[id] = _name
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

      const name_init = segments[l - 1]

      const class_file_path = path.join(spec_folder_path, 'index.ts')
      const component_file_path = path.join(spec_folder_path, 'Component.ts')

      const relative_folder_path = path
        .relative(systemDir, spec_folder_path)
        .split(path.sep)
        .join('/')

      if (existsSync(class_file_path)) {
        let name = name_init
        let i = 0

        while (class_name_set.has(name)) {
          name = name_init + i
          i++
        }

        class_name_set.add(name)

        classes_import += `import ${name} from './${relative_folder_path}'\n`
        classes_export += `\t'${id}': ${name},\n`
      }

      if (existsSync(component_file_path)) {
        let name = name_init
        let i = 0

        while (component_name_set.has(name)) {
          name = name_init + i
          i++
        }

        component_name_set.add(name)

        components_import += `import ${name} from './${relative_folder_path}/Component'\n`
        components_export += `\t'${id}': ${name},\n`
      }

      for (const id of spec.deps ?? []) {
        const system_spec = system_specs[id] as Spec

        if (!system_spec) {
          throw new Error(`Could not find dep ${id}`)
        }

        const system_folder_path = system_id_to_folder_path[system_spec.id]

        include(id, system_spec, system_folder_path)
      }
    }

    include(id, spec, folder_path)
  }

  classes_export += '}'

  components_export += '}'
  components = components_import + '\n' + components_export

  classes = classes_import + '\n' + classes_export

  specs = `export default JSON.parse(\`${JSON.stringify(_specs, null, 2)
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')}\`)\n`

  return { specs, classes, components, ids }
}
