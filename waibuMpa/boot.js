import pageBuilder from '../lib/page-builder.js'
import postBuilder from '../lib/post-builder.js'
import pageRedirect from '../lib/page-redirect.js'

async function boot () {
  if (this.config.page.virtual) {
    await this.instance.route(pageBuilder.call(this, true))
    await pageRedirect.call(this, true)
  }
  await pageRedirect.call(this)
  await this.instance.route(pageBuilder.call(this))
  await this.instance.route(postBuilder.call(this))
}

export default boot
