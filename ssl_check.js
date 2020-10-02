const https = require('https');
const http = require('http');

ssl_check = (url) => {
    const client = url.indexOf('https') === 0 ? https : http; 

    var req = client.request(url, function (res) {
        if (res.socket.authorized) {
        console.log('The website uses SSL Certificate!!');
        } else {
        console.log('The website does not use SSL Certificate!!');
        }
    });
    req.on('error', (e) => {
        console.error(e);
    });
    req.end();
}

module.exports = ssl_check