export default {
  url: async function () {
    const { prefix, route } = this.config.post
    return `/${prefix}/${route}`
  },
  handler: async function (req, reply) {
    const { getModel } = this.app.dobo
    const { slug, year, month, date } = req.params
    const model = getModel('CmsPost')
    const post = await model.findOne({ query: { slug, status: 'PUBLISHED' } })
    if (!post) throw this.error('_notFound')
    if (year && post.updatedAt.getFullYear() !== parseInt(year)) throw this.error('_notFound')
    if (month && (post.updatedAt.getMonth()) + 1 !== parseInt(month)) throw this.error('_notFound')
    if (date && post.updatedAt.getDate() !== parseInt(date)) throw this.error('_notFound')
    const tpl = 'sumbaCms.template:/post.html'
    const page = { title: post.title }
    return reply.view(tpl, { post, page })
  }
}
