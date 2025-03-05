import path from 'path'

function pageUp (file, base, req) {
  const { takeRight } = this.app.bajo.lib._
  const up = path.dirname(file)
  const parts = takeRight(up.split('/'), 3)
  if (req.params.ns === parts[1] || req.params.ns === parts[2]) return // plugin entry
  if (parts[0] === 'data' && parts[1] === 'plugins') return // main entry
  return this.pageDetails(up, base, req)
}

export default pageUp
