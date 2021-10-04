import { writeFileSync } from 'fs'
import { readJSONSync } from 'fs-extra'
import * as glob from 'glob'
import { PATH_SRC_SYSTEM } from '../path'
import { removeLastSegment } from '../removeLastSegment'
import { _getSpecTypeInterface } from '../spec/type'
import _specs from '../system/_specs'

const cwd = PATH_SRC_SYSTEM

let count = 0

glob
  .sync(`**/**/spec.json`, {
    cwd,
  })
  .map((path) => removeLastSegment(path))
  .forEach((_) => {
    const spec_file_path = `${cwd}/${_}/spec.json`
    const spec = readJSONSync(spec_file_path)
    const segments = _.split('/')
    const l = segments.length
    const tags = segments.slice(0, l - 1)
    spec.metadata = spec.metadata || {}
    spec.metadata.tags = tags
    const { id, inputs = {}, outputs = {} } = spec

    const typeInterface = _getSpecTypeInterface(spec, _specs)

    for (const input_name in inputs) {
      const input = inputs[input_name]
      const { type } = input
      if (!type) {
        const _type = typeInterface['input'][input_name].value
        console.log(_, 'input', input_name, _type)
        spec.inputs[input_name].type = _type
        count++
      }
    }
    for (const output_name in outputs) {
      const output = outputs[output_name]
      const { type } = output
      if (!type) {
        const _type = typeInterface['output'][output_name].value
        console.log(_, 'output', output_name, _type)
        spec.outputs[output_name].type = _type
        count++
      }
    }

    writeFileSync(spec_file_path, JSON.stringify(spec, null, 2))
  })

console.log(count)
