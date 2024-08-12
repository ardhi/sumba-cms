import dataRoutes from '../lib/data-routes.js'

async function boot (ctx, prefix) {
  await dataRoutes.call(this)
}

export default boot
