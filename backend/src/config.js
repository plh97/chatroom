const publicIp = require('public-ip');
const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

module.exports = {
    privateKey: process.env.PRIVATE_KEY || String(Math.random()),
    frontendOrigin: `http://localhost:${FRONTEND_PORT}`,
    // frontendOrigin: `http://${await publicIp.v4()}:${FRONTEND_PORT}`,
    backendOrigin: (async () => {
        return (`http://${await publicIp.v4()}:9002`)
    })(),
}