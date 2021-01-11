// const publicIp = require('public-ip');
var md5 = require('md5'); 
// const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

module.exports = {
    privateKey: process.env.PRIVATE_KEY || md5(Math.random()),
    personIcon: 'https://user-images.githubusercontent.com/14355994/104220451-7922d000-547a-11eb-8949-e3500d1db619.jpeg',
    roomIcon: 'https://m.media-amazon.com/images/M/MV5BZmQ5NGFiNWEtMmMyMC00MDdiLTg4YjktOGY5Yzc2MDUxMTE1XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_UY1200_CR93,0,630,1200_AL_.jpg',
    // frontendOrigin: `http://localhost:${FRONTEND_PORT}`,
    // frontendOrigin: `http://${await publicIp.v4()}:${FRONTEND_PORT}`,
    // backendOrigin: (async () => {
    //     return (`http://${await publicIp.v4()}:9002`)
    // })(),
}