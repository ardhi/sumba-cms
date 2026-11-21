/**
 * Plugin factory
 *
 * @param {string} pkgName - NPM package name
 * @returns {class}
 */
async function factory (pkgName) {
  const me = this

  /**
   * SumbaCms class
   *
   * @class
   */
  class SumbaCms extends this.app.baseClass.Base {
    constructor () {
      super(pkgName, me.app)
      const prefix = 'cms'
      const params = { action: 'list' }
      this.config = {
        waibu: {
          prefix
        },
        waibuMpa: {
          prefix: '',
          logo: 'newspaper',
          icon: 'newspaper',
          menuHandler: [{
            title: 'news',
            children: [{
              title: '-',
              home: true,
              level: -99
            }, {
              title: 'post',
              home: true,
              level: -100,
              href: 'sumbaCms:/post'
            }]
          }],
          redirect: {},
          redirectSubRoute: {
          }
        },
        waibuAdmin: {
          modelDisabled: 'all',
          menuHandler: [
            { title: 'post', href: `waibuAdmin:/${prefix}/post/:action`, params },
            { title: 'postCat', href: `waibuAdmin:/${prefix}/post-cat/:action`, params }
          ]
        },
        post: {
          prefix: 'post',
          route: '/:year/:month/:date/:slug'
        },
        page: {
          prefix: '',
          route: '/**'
        }
      }
    }

    formatPostItem = async (body = {}) => {
      const { isEmpty, isArray, pick } = this.app.lib._
      const { createExcerpt } = this.app.lib.aneka
      const { formatContent } = this.app.bajoTemplate
      const { routePath } = this.app.waibu

      if (isEmpty(body.data)) return
      const isDataArray = isArray(body.data)
      if (!isDataArray) body.data = [body.data]
      for (const d of body.data) {
        if (isEmpty(d.excerpt)) {
          d.excerpt = createExcerpt({ content: d.content, maxWords: 20 })
        }
        const params = pick(d, ['id', 'slug'])
        params.date = d.createdAt.getDate()
        params.month = d.createdAt.getMonth() + 1
        params.year = d.createdAt.getFullYear()
        const { prefix, route } = this.config.post
        d.slug = routePath(`sumbaCms:/${prefix}/${route}`, { params })
        d.content = formatContent(d.content, { smallHeading: true })
      }
      if (!isDataArray) body.data = body.data[0]
    }
  }

  return SumbaCms
}

export default factory
