async function init () {
  const { getPluginDataDir } = this.app.bajo
  const { fs } = this.app.bajo.lib
  const dir = `${getPluginDataDir(this.name)}/pages`
  fs.ensureDirSync(dir)
}

export default init
