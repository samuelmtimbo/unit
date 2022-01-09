export function getChildIndex(child: ChildNode): number {
  let i = 0
  for (i = 0; (child = child.previousSibling); i++) {}
  return i
}
