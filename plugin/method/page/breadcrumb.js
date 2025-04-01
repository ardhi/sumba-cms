function breadcrumb (file, base, req) {
  const { trim, map } = this.lib._

  const route = trim(file.replace(base, ''), '/')
  const result = map(this.breakPath(route), r => {
    const f = `${base}/${r}`
    const opts = { active: f === file }
    return this.pageDetails(f, base, req, opts)
  })
  return result
}

export default breadcrumb
