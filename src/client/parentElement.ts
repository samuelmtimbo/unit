export default function parentElement(): HTMLDivElement {
  const $parent = document.createElement('div')
  $parent.className = '__parent'
  $parent.style.display = 'contents'
  return $parent
}
