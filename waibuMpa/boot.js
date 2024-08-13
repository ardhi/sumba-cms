import buildRoutes from '../lib/build-routes.js'

async function boot (ctx, prefix) {
  await buildRoutes.call(this, ctx, prefix)
}

export default boot
