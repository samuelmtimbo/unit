import { WebTemplate } from './WebTemplate'
import { ROOT_STYLE } from './client/render/attachStyle'
import { FONT_DATA_URI } from './client/static/font/dataURI'

export const DEFAULT_CONTENT_SECURITY_POLICY = `connect-src 'self' ws: https: http: blob: ipfs: ipns: hyper: data: unit:`
export const ALLOW_ALL_CONTENT_SECURITY_POLICY = `${DEFAULT_CONTENT_SECURITY_POLICY} *`

export async function html(opt: WebTemplate): Promise<string> {
  let {
    pathname,
    title = 'Unit Website',
    description = 'This website was developed with the Unit Programming Language.',
    head = '',
    html: baseHtml,
    pwa = false,
    background = true,
    csp = DEFAULT_CONTENT_SECURITY_POLICY,
    script = true,
    manifest = '/manifest.json',
    sw = '/sw.js',
  } = opt

  /* html */
  const html = `
<!DOCTYPE html>
<html
  lang="en"
  style="
    ${background ? 'background-color: #1f1f1f;' : ''}
    color: #f1f1f1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  "
  translate="no"
>
  <head>
    <title>${title}</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, height=device-height, user-scalable=no, initial-scale=1.00, maximum-scale=1.00, minimum-scale=1.00"
    />
    <meta
      http-equiv="Content-Security-Policy"
      content="${csp}"
    />
    <meta
      name="description"
      content="${description}"
    />
    <meta name="theme-color" content="#ffffff" />
    ${pwa ? `<link rel="manifest" href="${manifest}" />` : ''}
    <link rel="shortcut icon" href="favicon.svg" />

    <style>
      @font-face {
        font-family: 'Inconsolata';
        /* 
        src: local('Inconsolata Regular'),
          url('${pathname}/fonts/Inconsolata-Regular.woff2') format('woff2'),
          url('${pathname}/fonts/Inconsolata-Regular.woff') format('woff');
        */
        src: url('${FONT_DATA_URI}');
        font-style: normal;
        font-weight: 400;
        font-stretch: 100%;
        font-display: fallback;
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
          U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
          U+2212, U+2215, U+FEFF, U+FFFD;
      }

      @font-face {
        font-family: 'Inconsolata';
        src: local('Arial');
        unicode-range: U+60;
      }
      
      * {
        font-family: Inconsolata;
      }

      body {
        font-family: Inconsolata;
        position: absolute;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        font-size: 14px;
        box-sizing: border-box;
        background: transparent;
        // touch-action: none;
        overflow: hidden;
        -ms-text-size-adjust: none;
        -webkit-text-size-adjust: none;
        overscroll-behavior: none;
        -webkit-touch-callout: none;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-overflow-scrolling: touch;
      }

      ${ROOT_STYLE}
    </style>
    ${head}
  </head>
  <body>
    <div
      id="__SYSTEM__ROOT__"
      style="
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: auto;
      "
    >
      ${baseHtml || ''}
    </div>${
      script
        ? `<script type="text/javascript" src="${pathname}/index.js"></script>`
        : ``
    }${
      pwa
        ? `<script type="text/javascript">
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('${sw}')
        })
      }
    </script>`
        : ''
    }
  </body>
</html>
  `

  return html
}
