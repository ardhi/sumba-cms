import pageRoute from '../lib/page-route.js'

async function boot (ctx, prefix) {
  await pageRoute.call(this, ctx, prefix)
}

export default boot
