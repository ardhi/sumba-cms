function breadcrumb (file, base, req) {
  const { trim, map } = this.app.bajo.lib._

  const route = trim(file.replace(base, ''), '/')
  const result = map(this.breakPath(route), r => {
    const f = `${base}/${r}`
    const opts = { active: f === file }
    return this.pageDetails(f, base, req, opts)
  })
  console.log(result)
  return result
}

export default breadcrumb
