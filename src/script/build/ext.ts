import path = require('path')
import { PATH_SRC_CLIENT_EXTENSION_SRC } from '../../path'
import { build } from '../build'

for (const name of ['background', 'content', 'options', 'popup']) {
  build({
    minify: true,
    sourcemap: false,
    bundle: true,
    logLevel: 'warning',
    entryPoints: [path.join(PATH_SRC_CLIENT_EXTENSION_SRC, `${name}.ts`)],
    define: {
      'globalThis.env': '{"NODE_ENV": "production"}',
    },
    outfile: path.join(PATH_SRC_CLIENT_EXTENSION_SRC, `${name}.js`),
  })
}

export default null
