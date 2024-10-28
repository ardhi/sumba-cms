import path from 'path'
import { isVisible } from './page/_lib.js'

function handlePage (ofile, base, req) {
  const { fs } = this.app.bajo.lib
  const { last } = this.app.bajo.lib._
  const types = ['', ...this.types]
  const type = last(base.split('/'))

  let file
  for (const type of types) {
    const check = `${ofile}${type}`
    if (fs.existsSync(check)) {
      file = check
      break
    }
  }
  if (!file) throw this.error('notFound')
  if (!isVisible.call(this, file, req)) throw this.error('notFound')

  const main = this.pageDetails(file, base, req)
  const siblings = this.pageSiblings(file, base, req)
  const children = this.pageChildren(file, base, req)
  const up = this.pageUp(file, base, req)
  const index = this.pageIndex(file, base, req)
  const next = this.pageNext(file, base, req, { siblings })
  const prev = this.pagePrev(file, base, req, { siblings, up })
  const breadcrumb = this.pageBreadcrumb(file, base, req)
  const toc = req.params['*'] === '' ? this.pageToc(null, base, req, { originalBase: base, props: ['title', 'permalink'] }) : undefined
  return { type, main, siblings, children, up, index, prev, next, breadcrumb, toc }
}

async function pageInfo (req, base = '') {
  const { trim, merge } = this.app.bajo.lib._
  const { fs } = this.app.bajo.lib
  const route = trim(req.params['*'], '/')
  const file = trim(`${base}/${route}`, '/')
  if (path.extname(file) === '') return merge({}, handlePage.call(this, file, base, req), { ns: req.params.ns })
  if (!fs.existsSync(file)) throw this.error('notFound')
  return { type: 'assets', ns: req.params.ns, main: this.pageDetails(file, base, req, { removeExt: false }) }
}

export default pageInfo
