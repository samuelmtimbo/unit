import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { basename, dirname, join, sep } from 'path'
import { PATH_SRC_SYSTEM } from '../path'

const cwd = PATH_SRC_SYSTEM
let count = 0

const files = readdirSync(cwd, { recursive: true, encoding: 'utf8' })

for (const file of files) {
  if (basename(file) !== 'spec.json') continue

  const specFilePath = join(cwd, file)
  const spec = JSON.parse(readFileSync(specFilePath, 'utf8'))

  const dir = dirname(file)
  const segments = dir === '.' ? [] : dir.split(sep)
  const tags = segments.slice(0, -1)

  spec.metadata = spec.metadata || {}
  spec.metadata.tags = tags

  writeFileSync(specFilePath, JSON.stringify(spec, null, 2))
  count++
}

console.log(count)
