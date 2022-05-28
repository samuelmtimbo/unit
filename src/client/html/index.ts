// import { INDEX_JS } from '../static/js/index.js'
import { BundleSpec } from '../../types/BundleSpec'
import { FONT_DATA_URI } from '../static/font/dataURI'

const INDEX_JS = 'console.log("TODO")'

export function makeHTML(bundle: BundleSpec, opt: {}): string {
  const html = `
    <!DOCTYPE html>
    <html
      lang="en"
      style="background-color: #1f1f1f; color: #f1f1f1; position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      translate="no"
    >
      <head>
        <title>unit</title>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, user-scalable=no, initial-scale=1.00, maximum-scale=1.00, minimum-scale=1.00"
        />
        <meta
          http-equiv="Content-Security-Policy"
          content="connect-src 'self' ws: http:"
        />
        <meta
          name="description"
          content="Next Generation Visual Programming Platform"
        />
        <meta name="theme-color" content="#dddddd" />

        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" sizes="16x16 32x32 64x64" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="196x196" href="/favicon_192.png" />
        <link rel="icon" type="image/png" sizes="160x160" href="/favicon_160.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon_96.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon_64.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_16.png" />
        <link rel="apple-touch-icon" href="/favicon_57.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/favicon_114.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon_72.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon_144.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/favicon_60.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/favicon_120.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/favicon_76.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon_152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_180.png" />
        <meta name="msapplication-TileColor" content="#1f1f1f" />
        <meta name="msapplication-TileImage" content="/favicon_144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f1f1f1" />
    
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="unit" />
        <meta
          property="og:description"
          content="Next Generation Visual Programming Platform"
        />
        <meta property="og:url" content="https://ioun.it/" />
        <meta property="og:image" content="https://public.ioun.it/og_512_0.png" />
        <meta property="og:type" content="website" />
    
        <style>
          @font-face {
            font-family: 'Inconsolata';
            /* 
            src: local('Inconsolata Regular'),
              url('/fonts/Inconsolata-Regular.woff2') format('woff2'),
              url('/fonts/Inconsolata-Regular.woff') format('woff');
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
    
          *::-webkit-scrollbar {
            -webkit-appearance: none;
            width: 1px;
            height: 1px;
          }
          *::-webkit-scrollbar-track {
            background-color: #00000000;
          }
          *::-webkit-scrollbar-thumb {
            opacity: 0.5;
            background-color: currentColor;
          }
          *::-webkit-scrollbar-corner {
            display: none;
          }
          * {
            scrollbar-width: thin;
            scrollbar-color: currentColor #00000000;
          }
    
          input,
          textarea,
          button,
          select,
          canvas,
          image,
          a,
          div {
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          }

          input::-webkit-outer-spin-button,
          input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type='number'] {
            -moz-appearance: textfield;
          }
    
          input::-webkit-color-swatch-wrapper {
            padding: 0;
          }
          input::-webkit-color-swatch,
          input::-moz-color-swatch {
            border: none;
          }
          input::-ms-reveal {
            display: none !important;
          }
          input::-webkit-caps-lock-indicator {
            display: none !important;
          }
          input::-webkit-credentials-auto-fill-button {
            display: none !important;
            visibility: hidden;
            pointer-events: none;
            position: absolute;
            right: 0;
          }
    
          input[type='color'] {
            -webkit-appearance: none;
            border: none;
            width: 32px;
            height: 32px;
          }
          input[type='color']::-webkit-color-swatch-wrapper {
            padding: 0;
          }
          input[type='color']::-webkit-color-swatch {
            border: none;
          }

          input[type="color"]::-webkit-color-swatch {
            border-top-left-radius: 0px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
            border-bottom-left-radius: 0px;
          }
    
          audio {
            width: 100%;
            height: 100%;
            border-radius: 0;
          }
    
          audio::-webkit-media-controls-enclosure {
            border-radius: 0;
            max-height: none;
          }
    
          audio::-webkit-media-controls-panel {
            padding: 0;
          }
    
          audio::-webkit-media-controls-timeline {
            padding-left: 8px;
            padding-right: 0px;
          }
    
          audio::-webkit-media-controls-current-time-display {
            margin-left: 0;
            font-size: 12px;
          }
    
          audio::-webkit-media-controls-time-remaining-display,
          audio::-webkit-media-controls-current-time-display {
            font-size: 12px;
          }

          a {
            color: currentcolor;
          }
    
          * {
            font-family: 'Inconsolata', monospace;
            caret-color: currentcolor;
          }

          *:focus {
            outline: none;
            // outline-width: 1px;
            // outline-color: #ffcc00;
            // outline-offset: -1px;
            // outline-style: dashed;
          }
    
          body {
            position: absolute;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            background: transparent;
            /* touch-action: none; */
            overflow: hidden;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-text-size-adjust: none;
            -webkit-text-size-adjust: none;
            overscroll-behavior: none;
            -webkit-touch-callout: none;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            -webkit-overflow-scrolling: touch;
          }
        </style>
      </head>
      <body>
        <div
          id="__SYSTEM__ROOT__"
          style="display: block; position: absolute; width: 100%; height: 100%;"
        >
        </div>
        <script
          type="text/javascript"
        >
${INDEX_JS}
        </script>
      </body>
    </html>
    `

  return html
}
