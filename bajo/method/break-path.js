function breakPath (route, delimiter = '/') {
  const { trim, last } = this.app.bajo.lib._
  route = trim(route, delimiter)
  const parts = route.split(delimiter)
  const routes = []
  for (const p of parts) {
    const l = last(routes)
    routes.push(l ? `${l}${delimiter}${p}` : p)
  }
  return routes
}

export default breakPath
