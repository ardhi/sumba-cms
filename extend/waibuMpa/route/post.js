async function post (req, reply) {
  const { findRecord, getSchemaExt } = this.app.waibuDb
  const opts = {
    schema: {
      common: {
        disabled: ['create', 'update', 'remove', 'get'],
        format: {
        }
      }
    }
  }
  const model = 'CmsPost'
  const { schema } = await getSchemaExt(model, 'list', opts)
  const query = { status: 'PUBLISHED' }
  const options = { query, mergeQuery: true, count: true, suppressError: ['findRecord'], fmt: true, allowExport: true, attachment: true }
  const posts = await findRecord({ model: 'CmsPost', req, reply, options })
  const categories = await this.app.dobo.getModel('cmsPostCat').findRecord({ sort: { level: 1, name: 1 } })
  return reply.view('sumbaCms.template:/post/list.html', { posts, categories, schema })
}

export default post
