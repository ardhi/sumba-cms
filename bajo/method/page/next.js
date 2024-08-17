function next (file, base, req, { siblings = [] } = {}) {
  const { find, findIndex } = this.app.bajo.lib._

  let idx = findIndex(siblings, { file })
  if (idx === -1) return
  idx++
  if (idx < siblings.length) return siblings[idx]
  const dir = find(siblings, { isDir: true })
  if (!dir) return
  return this.pageChildren(dir.file, base, req)[0]
}

export default next
