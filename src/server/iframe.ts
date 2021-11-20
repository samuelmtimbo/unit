export default function (url: string) {
  return `
  <!DOCTYPE html>
  <html
    lang="en"
    style="background-color: #1f1f1f; color: #f1f1f1;"
    translate="no"
  >
    <title>unit</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, height=device-height, user-scalable=no, initial-scale=1.00, maximum-scale=1.00, minimum-scale=1.00"
    />
    <head>
      <style>
        body {
          position: absolute;
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          background: transparent;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          overscroll-behavior: none;
          -webkit-touch-callout: none;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          -webkit-overflow-scrolling: touch;
        }
s      </style>
    </head>
    <body>
      <iframe
        src="${url}"
        sandbox="
          allow-downloads
          allow-forms
          allow-modals
          allow-orientation-lock
          allow-pointer-lock
          allow-popups
          allow-popups-to-escape-sandbox
          allow-presentation
          allow-same-origin
          allow-scripts
        "
        style="
          position: absolute;
          top: 50%;
          left: 50%;
          height: 90%;
          width: 90%;
          border: none;
          transform: translate(-50%, -50%);
          border: 1px solid #f1f1f1;
        "
      >
      </iframe>
    </body>
  </html>
  `
}
