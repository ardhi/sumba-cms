function prev (file, base, req, { siblings = [], up } = {}) {
  const { findIndex, last } = this.app.bajo.lib._

  let idx = findIndex(siblings, { file })
  if (idx === -1) return
  idx--
  if (idx > -1) return siblings[idx]
  if (!up) return
  return last(this.pageSiblings(up.file, base, req))
}

export default prev
