async function handleTocEntry (req, reply, info) {
  const { renderString, base64JsonEncode } = this.app.waibuMpa
  const data = base64JsonEncode(info.toc)
  const text = `<c:tree data="${data}" />`
  const page = {
    type: 'pages',
    main: {},
    children: [],
    siblings: []
  }
  reply.header('Content-Type', `text/html; charset=${this.app.waibuMpa.config.page.charset}`)
  reply.header('Content-Language', req.lang)
  const opts = { ext: '.html', layout: 'sumbaCms:/page.html' }
  return await renderString(text, { page }, reply, opts)
}

export default handleTocEntry
