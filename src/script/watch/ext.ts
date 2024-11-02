import * as path from 'path'
import { PATH_SRC_CLIENT_EXTENSION_SRC } from '../../path'
import { watch } from '../build'

for (const name of ['background', 'content', 'options', 'popup']) {
  watch({
    minify: false,
    sourcemap: true,
    bundle: true,
    logLevel: 'warning',
    entryPoints: [path.join(PATH_SRC_CLIENT_EXTENSION_SRC, `${name}.ts`)],
    define: {
      'globalThis.env': '{"NODE_ENV": "development"}',
    },
    outfile: path.join(PATH_SRC_CLIENT_EXTENSION_SRC, `${name}.js`),
  })
}
