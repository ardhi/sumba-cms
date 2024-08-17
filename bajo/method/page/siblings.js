import path from 'path'
import { getFiles } from './_lib.js'

function pageSiblings (file, base, req) {
  const { map } = this.app.bajo.lib._

  const dir = path.dirname(file)
  const files = getFiles.call(this, dir)
  return map(files, f => {
    const opts = { active: f === file }
    return this.pageDetails(f, base, req, opts)
  })
}

export default pageSiblings
