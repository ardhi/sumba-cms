async function postInfo (req, base = '') {
  const { fastGlob } = this.app.bajo.lib

  const year = req.params.year ?? '*'
  const month = req.params.month ?? '*'
  const day = req.params.day ?? '*'
  const pattern = `${base}/${year}/${month}/${day}/${req.params.slug}.{md,html}`
  const file = fastGlob.globSync(pattern)[0]
  if (!file) throw this.error('notfound')
  const main = this.postDetails(file, req)
  if (!main) throw this.error('notfound')
  return { type: 'posts', main }
}

export default postInfo
