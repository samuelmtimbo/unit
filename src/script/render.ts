import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, join } from 'path'
import { PATH_BUILD_SYSTEM_PLATFORM_CORE_COMPONENT } from '../path'

// const cwd = PATH_BUILD_SYSTEM_PLATFORM_COMPONENT
const cwd = PATH_BUILD_SYSTEM_PLATFORM_CORE_COMPONENT

const files = readdirSync(cwd, { recursive: true, encoding: 'utf8' })

for (const file of files) {
  if (basename(file) !== 'spec.json') continue

  const specFilePath = join(cwd, file)
  const spec = JSON.parse(readFileSync(specFilePath, 'utf8'))

  console.log(spec.name)

  spec.render = true

  writeFileSync(specFilePath, JSON.stringify(spec, null, 2))
}
