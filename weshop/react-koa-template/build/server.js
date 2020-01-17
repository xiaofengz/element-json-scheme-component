const Koa = require('koa')
const webpack = require('webpack')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackcfg = require('./webpack.config')
const program = require('commander')

// const proxyMiddleware = require('./proxy')
const { blue, red } = require('chalk')

const app = new Koa()
const compiler = webpack(webpackcfg)
const koaHotMiddleware = webpackHotMiddleware(compiler, {
    reload: true
})
const koaDevMiddleware = webpackDevMiddleware(compiler, {
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }
})
const port = process.argv[2] || 8001
// compiler.plugin('compilation', function (compilation) {
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//     koaHotMiddleware.publish({
//       action: 'reload'
//     })
//     cb()
//   })
// })
app.use(async (ctx, next) => {
  await koaDevMiddleware(ctx.req, {
    end: (content) => {
      ctx.body = content
    },
    setHeader: (name, value) => {
      ctx.set(name, value)
    }
  }, next)
})
app.use(async (ctx, next) => {
  await new Promise((resolve) => koaHotMiddleware(ctx.req, ctx.res, resolve))
  next()
})
// app.use(proxyMiddleware)
app.listen(port, () => {
  koaDevMiddleware.waitUntilValid(function () {
    console.log(`\n> Listening at ${blue(`http://localhost:${port}`)}`)
    console.log(`> Listening at ${blue(`http://${getIPAdress()}:${port}`)}\n`)
  })
})

function getIPAdress () {
  var interfaces = require('os').networkInterfaces()
  for (var devName in interfaces) {
    var iface = interfaces[devName]
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}
