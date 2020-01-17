const { test, rm } = require('shelljs')
const webpack = require('webpack')
const cfg = require('./webpack.config')
const Ora = require('ora')


// cfg.output.publicPath = 'https://w1.weshop.com/wxcdn/bd3fc0/';

const ora = Ora('删除旧目录').start()
if (test('-e', cfg.output.path)) {
  rm('-rf', cfg.output.path)
}
ora.succeed().render().start('开始构建')
const compiler = webpack(cfg, function (err, stats) {
  if (err) throw err
})
compiler.plugin('done', stats => {
  process.stdout.write(`\n` + stats.toString({
    colors: true,
    modules: true,
    children: true,
    chunks: true,
    chunkModules: true
  }))
})
compiler.apply(new webpack.ProgressPlugin((percent, msg, addInfo) => {
  percent = Math.floor(percent * 100)
  if (percent === 100) msg = 'Compilation completed'
  if (addInfo) msg = `${msg} (${addInfo})`
  ora.succeed().render().start(`${percent}%  ${msg}`)
  if (percent === 100) {
    ora.succeed('构建完成')
  }
}))
