export default function createPopupWindow(
  pageURL: string,
  pageTitle: string,
  popupWidth: number = 420,
  popupHeight: number = 600
): Window {
  const left = screen.width / 2 - popupWidth / 2
  const top = screen.height / 2 - popupHeight / 2
  const features = `resizable=false, width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}`
  return window.open(pageURL, pageTitle, features)
}
