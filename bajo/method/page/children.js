import path from 'path'
import { getFiles } from './_lib.js'

function pageChildren (dir, base, req) {
  const { map } = this.app.bajo.lib._

  if (path.extname(dir) !== '') return []
  const files = getFiles.call(this, dir, req)
  return map(files, f => this.pageDetails(f, base, req))
}

export default pageChildren
