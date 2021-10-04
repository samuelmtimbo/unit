export default function fullwindowElement(): HTMLDivElement {
  const $container = document.createElement('div')
  $container.className = '__fullwindow'
  $container.style.position = 'absolute'
  $container.style.display = 'flex'
  $container.style.flexWrap = 'wrap'
  $container.style.width = '100%'
  $container.style.height = '100%'
  $container.style.top = '0'
  $container.style.left = '0'
  // @ts-ignore
  $container.style.contain = 'size layout style paint'
  // $container.style.overflow = 'hidden'
  $container.style.overflow = 'auto'
  return $container
}
