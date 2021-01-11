// const publicIp = require('public-ip');
var md5 = require('md5'); 
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

module.exports = {
    privateKey: process.env.PRIVATE_KEY || md5(Math.random()),
    // frontendOrigin: `http://localhost:${FRONTEND_PORT}`,
    // frontendOrigin: `http://${await publicIp.v4()}:${FRONTEND_PORT}`,
    // backendOrigin: (async () => {
    //     return (`http://${await publicIp.v4()}:9002`)
    // })(),
}