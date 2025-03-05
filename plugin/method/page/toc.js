import path from 'path'
import { getFiles } from './_lib.js'

function toc (file, base, req, opts = {}) {
  const items = getFiles.call(this, base, req)
  const result = []
  for (const item of items) {
    const details = this.pageDetails(item, base, req, opts)
    if (path.extname(item) === '') {
      details.children = toc.call(this, null, item, req, opts)
    }
    result.push(details)
  }
  return result
}

export default toc
