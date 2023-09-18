export const joinLeafPath = (leafPath: string[]): string => {
  const leaf_id = leafPath.join('/')

  return leaf_id
}
