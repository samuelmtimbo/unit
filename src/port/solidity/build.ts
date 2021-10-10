import { readFileSync, writeJSONSync } from 'fs-extra'
import * as glob from 'glob'
import * as path from 'path'

const _cwd = 'src/port/solidity'

const cwd = path.join(_cwd, 'contracts')

const bundle = {}

glob
  .sync(`**/*.sol`, {
    cwd,
  })
  .forEach((_) => {
    console.log(_)

    const filepath = path.join(cwd, _)

    const content_blob = readFileSync(filepath)

    const contents = content_blob.toString()

    bundle[_] = { contents }
  })

const BUNDLE_FILEPATH = path.join(_cwd, '_bundle.json')

writeJSONSync(BUNDLE_FILEPATH, bundle)
