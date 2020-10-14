const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const cors = require('cors')
var cookieParser = require('cookie-parser')
const app = express()
const port = process.env.PORT || 9002
const privateKey = process.env.PRIVATE_KEY || String(Math.random())

app.use(cookieParser())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  if (req.headers.origin) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
  }
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, Access-Control-Request-Headers, Access-Control-Request-Method, Connection, Host, Origin, User-Agent, Referer, Cache-Control, X-header')
  next()
})



app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const account = {}
const tokenContainer = {}

app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies && req.cookies.token;
  const whiteList = ['/login', '/register']
  if (whiteList.includes(req.url)) {
    next();
  } else {
    if (tokenContainer[cookie]) {
      // check token
      jwt.verify(cookie, privateKey, function(err, token){
        if (err) {
          res.status(401)
          res.send({
            code: 1,
            message: 'token verify error'
          })
          return
        }
        res.send({
          code: 0,
          message: 'token verify success',
          data: {
            username: token
          }
        })
      });
    } else {
      res.status(401)
      res.send({
        message: 'not login'
      })
    }
  }
});

app.post('/login', function (req, res) {
  if (!req.body) return
  const { username, password } = req.body
  console.log(username, password)
  if (username === '1' && password === '1') {
    // pass
    var token = jwt.sign(username, privateKey);
    res.cookie('token', token, { maxAge: 900000, httpOnly: true });
    console.log('cookie created successfully', token);
    tokenContainer[token] = true
    res.send({
      token,
      message: 'login success'
    })
  } else {
    res.send({
      message: 'password or username wrong'
    })
  }
})

app.get('/userinfo', function (req, res) {
  var cookie = req.cookies.cookieName;
  res.send({})
})

app.listen(port, () => {
  console.log(`listening at port ${port}`)
})