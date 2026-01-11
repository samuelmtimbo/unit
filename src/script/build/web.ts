import { copyFile, ensureDir } from 'fs-extra';
import * as path from 'path';
import { PATH_PUBLIC } from '../../path';
import { build } from '../build';

const build_ = async (source: string, target: string, minify: boolean) => {
  const outfile =  `dist/${target}${minify ? '.min' : ''}.js`

  await build({
    minify: true,
    sourcemap: true,
    bundle: true,
    format: "iife",
    logLevel: 'warning',
    entryPoints: [`src/client/platform/web/${source}.ts`],
    outfile,
    metafile: true,
  })

  
  await ensureDir(path.join(PATH_PUBLIC, 'dist'))
  
  const publicPath = path.join(PATH_PUBLIC, outfile)
  
  await copyFile(outfile, publicPath)
}

void (async () => {
  await Promise.all([
    build_('web', 'index', true),
    build_('web', 'index', false),
    build_('global', 'global', true),
    build_('global', 'global', false),
  ])
})()

