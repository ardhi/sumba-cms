import { dynHooks } from './_common.js'

const postItem = {
  url: async function () {
    const { prefix, route } = this.config.post
    return `/${prefix}/${route}`
  },
  handler: async function (req, reply) {
    const { findOneRecord, getSchemaExt } = this.app.waibuDb
    const opts = {
      schema: {
        common: {
          disabled: ['create', 'update', 'remove'],
          format: {
          }
        }
      }
    }
    const model = 'CmsPost'
    const query = { status: 'PUBLISHED' }
    if (req.params.id) query.id = req.params.id
    else query.slug = req.params.slug
    const options = { query, mergeQuery: true, count: true, suppressError: ['findOneRecord'], fmt: true, allowExport: true, attachment: true, dynHooks }
    const post = await findOneRecord({ model: 'CmsPost', req, reply, options })
    if (!post.data) throw this.error('_notFound')
    if (req.params.year !== String(post.data.createdAt.getFullYear())) throw this.error('_notFound')
    if (req.params.month !== String(post.data.createdAt.getMonth() + 1)) throw this.error('_notFound')
    if (req.params.date !== String(post.data.createdAt.getDate())) throw this.error('_notFound')
    const { schema } = await getSchemaExt(model, 'list', opts)
    const categories = await this.app.dobo.getModel('cmsPostCat').findRecord({ sort: { level: 1, name: 1 } })
    return reply.view('sumbaCms.template:/post/item.html', { post, categories, schema })
  }
}

export default postItem
