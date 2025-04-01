import path from 'path'

async function handler (req, reply) {
  const { getPluginDataDir, importPkg } = this.app.bajo
  const { fs } = this.lib
  const { renderString } = this.app.waibuMpa
  const mime = await importPkg('waibu:mime')

  const base = `${getPluginDataDir(this.name)}/posts`
  const post = await this.postInfo(req, base)
  const ext = path.extname(post.main.file)
  let mimeType = mime.getType(ext)
  if (!mimeType || mimeType === 'text/markdown') mimeType = `text/html; charset=${this.app.waibuMpa.config.page.charset}`

  reply.header('Content-Type', mimeType)
  reply.header('Content-Language', req.lang)
  if (post.type === 'assets') return fs.readFileSync(post.file)
  const text = fs.readFileSync(post.main.file, 'utf8')
  const opts = { ext, layout: 'sumbaCms:/post.html' }
  return await renderString(text, { post }, reply, opts)
}

function postBuilder () {
  return {
    url: `/${this.config.post.prefix}${this.config.post.route}`,
    method: 'GET',
    config: {
      type: 'post',
      webApp: this.app.waibuMpa.name,
      ns: this.name
    },
    handler: handler.bind(this)
  }
}

export default postBuilder
