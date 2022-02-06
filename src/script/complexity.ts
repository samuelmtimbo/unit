import * as esbuild from 'esbuild'
import { writeFileSync } from 'fs'
import { pathExistsSync, readJSONSync } from 'fs-extra'
import * as glob from 'glob'
import { join } from 'path'
import { PATH_SRC, PATH_SRC_SYSTEM } from '../path'
import { treeComplexity } from '../spec/complexity'
import __specs from '../system/_specs'
import { Spec, Specs } from '../types'
import { removeLastSegment } from '../util/removeLastSegment'

function getBundleLength(path: string): number {
  const result = esbuild.buildSync({
    entryPoints: [path],
    bundle: true,
    splitting: false,
    minify: false,
    platform: 'node',
    minifyWhitespace: false,
    minifyIdentifiers: false,
    minifySyntax: false,
    sourcemap: false,
    // target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    // outfile: 'out.js',
    write: false,
  })
  const text = result.outputFiles[0].text
  return text.length
}

const PATH_SRC_CLASS_UNIT = join(PATH_SRC, 'Class/Unit/index.ts')

const UNIT_LENGTH = getBundleLength(PATH_SRC_CLASS_UNIT)

export function jsComplexityByPath(spec_path: string): number {
  const bundleLength = getBundleLength(spec_path)
  return bundleLength / UNIT_LENGTH
}

export function baseComplexityByPath(folder_path: string): number {
  let complexity = 0

  const index = `${folder_path}/index.ts`
  const has_index = pathExistsSync(index)
  if (has_index) {
    complexity += jsComplexityByPath(index)
  }

  const component = `${folder_path}/Component.ts`
  const has_component = pathExistsSync(component)
  if (has_component) {
    complexity += jsComplexityByPath(component)
  }

  return complexity
}

export const GLOBAL_COST: number = 9

export function refreshComplexity(specs: Specs, cwd: string): void {
  glob
    .sync(`**/**/index.ts`, {
      cwd,
    })
    .map((path) => removeLastSegment(path))
    .forEach((_) => {
      const folder_path = `${cwd}/${_}`
      const spec_path = `${folder_path}/spec.json`

      const spec = readJSONSync(spec_path)
      const {
        id,
        metadata: { globals = [] },
      } = spec as Spec

      let complexity: number

      complexity = baseComplexityByPath(folder_path)

      let global_complexity = 0
      for (const global_id of globals) {
        global_complexity += GLOBAL_COST
      }

      complexity += complexity + global_complexity

      complexity = Math.round(complexity)

      console.log(folder_path, complexity)

      spec.metadata = spec.metadata || {}
      spec.metadata.complexity = complexity

      specs[id] = spec

      writeFileSync(spec_path, JSON.stringify(spec, null, 2))
    })

  glob
    .sync(`**/**/spec.json`, {
      cwd,
    })
    .map((path) => removeLastSegment(path))
    .forEach((_) => {
      const folder_path = `${cwd}/${_}`
      const spec_path = `${folder_path}/spec.json`
      const spec = readJSONSync(spec_path)
      const { id, base } = spec as Spec

      if (base) {
        //
      } else {
        const complexity = treeComplexity(specs, spec, {})

        console.log(folder_path, complexity)

        spec.metadata = spec.metadata || {}
        spec.metadata.complexity = complexity

        specs[id] = spec

        writeFileSync(spec_path, JSON.stringify(spec, null, 2))
      }
    })
}

const specs = { ...__specs }

refreshComplexity(specs, PATH_SRC_SYSTEM)
