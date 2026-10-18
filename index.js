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
        waibuMpa: {
          logo: 'newspaper',
          icon: 'newspaper',
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
        }
      }
    }
  }

  return SumbaCms
}

export default factory
