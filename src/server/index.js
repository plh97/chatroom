const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
const path = require('path');
const selfSigned = require('openssl-self-signed-certificate')
const app = require('./app');
const config = require('../../config/server');
const port = process.env.PORT || config.port;
const options = {
  key: selfSigned.key,
  cert: selfSigned.cert
};

//Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead
mongoose.Promise = global.Promise;
mongoose.connect(config.proDatabase,{useMongoClient:true})
  .then(
    ()=>{
      if(process.env.NODE_ENV=="production"){
        http.createServer(app.callback()).listen(port);
      }else{
        http.createServer(app.callback()).listen(80);
        https.createServer(options , app.callback()).listen(443);
      }
    },
    err => console.log(err)
  )
