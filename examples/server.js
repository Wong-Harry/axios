const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

require('./server2')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname, {
  setHeaders(res) {
    res.cookie('XSRF-TOKEN-D', '1234abc')
  }
}))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

const router = express.Router()

reginsterSimpleRouter()
reginsterBaseRouter()
reginsterErrorRouter()
reginsterExtendRouter()
rejisterInterceptirRouter()
rejisterConfigRouter()
registerCancelRouter()
registerMoreRouter()

app.use(router)

const port = process.env.PORT || 8280
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

function reginsterSimpleRouter() {
  router.get('/simple/get', function (req, res) {
    res.json({
      msg: `hello Wong`
    })
  })
}

function reginsterBaseRouter() {
  router.get('/base/get', function (req, res) {
    res.json(req.query)
  })
  router.post('/base/post', function (req, res) {
    res.json(req.body)
  })
  router.post('/base/buffer', function (req, res) {
    let msg = []
    req.on('data', (chunk) => {
      if (chunk) {
        msg.push(chunk)
      }
    })
    req.on('end', () => {
      let buf = Buffer.concat(msg)
      res.json(buf.toJSON())
    })
  })
}

function reginsterErrorRouter() {
  router.get('/error/get', function (req, res) {
    if (Math.random() > 0.5) {
      res.json({
        msg: `hello world`
      })
    } else {
      res.status(500).end()
    }
  })

  router.get('/error/timeout', function (req, res) {
    setTimeout(() => {
      res.json({
        msg: `hello world`
      })
    }, 3000)
  })
}

function reginsterExtendRouter() {
  router.get('/extend/get', function (req, res) {
    res.json({
      msg: 'hello Word'
    })
  })
  router.get('/extend/user', function (req, res) {
    res.json({
      code: 0,
      message: 'ok',
      result: {
        name: 'HarryWong',
        age: 20
      }
    })
  })


  router.options('/extend/options', function (req, res) {
    res.end()
  })
  router.delete('/extend/delete', function (req, res) {
    res.end()
  })
  router.head('/extend/head', function (req, res) {
    res.end()
  })

  router.post('/extend/post', function (req, res) {
    res.json(req.body)
  })
  router.put('/extend/put', function (req, res) {
    res.json(req.body)
  })
  router.patch('/extend/patch', function (req, res) {
    res.json(req.body)
  })

  router.patch('/extend/user', function (req, res) {
    res.json({
      code: 0,
      msesage: 'ok',
      result: {
        name: 'HarryWong',
        age: 20
      }
    })
  })
}


function rejisterInterceptirRouter() {
  router.get('/interceptor/get', function (req, res) {
    res.end('hello')
  })
}

function rejisterConfigRouter() {
  router.post('/config/post', function (req, res) {
    res.json(req.body)
  })
}


function registerCancelRouter() {
  router.get('/cancel/get', function (req, res) {
    setTimeout(() => {
      res.json('hello')
    }, 1000)
  })

  router.post('/cancel/post', function (req, res) {
    setTimeout(() => {
      res.json(req.body)
    }, 1000)
  })
}

function registerMoreRouter() {
  router.get('/more/get', function (req, res) {
    res.json(req.cookies)
  })

  router.post('/more/upload', function (req, res) {
    console.log(req.body, req.files)
    res.end('upload success!')
  })

  router.post('/more/post', function (req, res) {
    const auth = req.headers.authorization
    const [type, credentials] = auth.split(' ')
    console.log(atob(credentials))
    const [username, password] = atob(credentials).split(':')
    if (type === 'Basic' && username === 'Yee' && password === '123456') {
      res.json(req.body)
    } else {
      res.status(401)
      res.end('UnAuthorization')
    }
  })

  router.get('/more/304', function (req, res) {
    res.status(304)
    res.end()
  })

  router.get('/more/A', function (req, res) {
    res.end('A')
  })

  router.get('/more/B', function (req, res) {
    res.end('B')
  })
}
