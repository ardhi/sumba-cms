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
  class SumbaCms extends this.app.pluginClass.base {
    static alias = 'cms'
    static dependencies = ['waibu-mpa']

    constructor () {
      super(pkgName, me.app)
      this.config = {
        waibu: {
          prefix: ''
        },
        page: {
          prefix: 'page'
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
