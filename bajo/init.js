async function init () {
  const { getPluginDataDir } = this.app.bajo
  const { fs } = this.app.bajo.lib
  for (const item of ['pages', 'posts']) {
    const dir = `${getPluginDataDir(this.name)}/${item}`
    fs.ensureDirSync(dir)
  }
}

export default init
