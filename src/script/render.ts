import { writeFileSync } from 'fs'
import { readJSONSync } from 'fs-extra'
import * as glob from 'glob'
import { PATH_BUILD_SYSTEM_PLATFORM_CORE_COMPONENT } from '../path'
import { removeLastSegment } from '../util/removeLastSegment'

// const cwd = PATH_BUILD_SYSTEM_PLATFORM_COMPONENT
const cwd = PATH_BUILD_SYSTEM_PLATFORM_CORE_COMPONENT

glob
  .sync(`**/**/spec.json`, {
    cwd,
  })
  .map((path) => removeLastSegment(path))
  .forEach((_) => {
    const spec_file_path = `${cwd}/${_}/spec.json`
    const spec = readJSONSync(spec_file_path)
    const segments = _.split('/')
    const { id, name, inputs = {}, outputs = {} } = spec

    console.log(name)

    spec.render = true

    writeFileSync(spec_file_path, JSON.stringify(spec, null, 2))
  })
