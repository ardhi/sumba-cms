import pageRouteBuilder from '../lib/page-route-builder.js'
import pageRouteRedirect from '../lib/page-route-redirect.js'

async function boot () {
  if (this.config.page.virtual) {
    await this.instance.route(pageRouteBuilder.call(this, true))
    await pageRouteRedirect.call(this, true)
  }
  await pageRouteRedirect.call(this)
  await this.instance.route(pageRouteBuilder.call(this))
}

export default boot
