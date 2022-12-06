// const publicIp = require('public-ip');
var md5 = require('md5');
// const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

module.exports = {
    privateKey: process.env.PRIVATE_KEY || new Buffer.from(md5(Math.random())).toString('base64'),
    personIcon: 'http://localhost:9002/image/naruto2.jpeg',
    roomIcon: 'https://m.media-amazon.com/images/M/MV5BZmQ5NGFiNWEtMmMyMC00MDdiLTg4YjktOGY5Yzc2MDUxMTE1XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_UY1200_CR93,0,630,1200_AL_.jpg',
    // frontendOrigin: `http://localhost:${FRONTEND_PORT}`,
    // frontendOrigin: `http://${await publicIp.v4()}:${FRONTEND_PORT}`,
    // backendOrigin: (async () => {
    //     return (`http://${await publicIp.v4()}:9002`)
    // })(),
}