const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const port = process.argv[2] || 8000;
const ipStore = require('./ipStore');

const mimeType = {
  '.ico': 'image/x-icon',
  '.html': 'text/html',
  '.js': 'text/javascript',
};


http.createServer(function (req, res) {
  const parsedUrl = url.parse(req.url),
  time = (new Date()).toISOString();

  console.log(`${time}: ${req.method} ${req.url}`);
  
  if(parsedUrl.pathname == '/ipstore' && req.method == 'POST') {
    let body = '';
    req.on('data', data => body += data);
    req.on('end', () => {
      console.log(`${time}: payload: ${body}`);
      const bodyJson = JSON.parse(body);
      bodyJson.userAgent = req.headers['user-agent'];
      bodyJson.timestamp = time;
      ipStore(bodyJson).then(() => {
        res.statusCode = 200;
        res.end(`IP stored.`);
      }, err => {
        res.statusCode = 500;
        res.end(err);
      })
    });
    return;
  }


  const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, '');
  let pathname = path.join(__dirname, sanitizePath);

  fs.exists(pathname, function (exist) {
    if(!exist) {
      res.statusCode = 404;
      res.end(`File ${pathname} not found!`);
      return;
    }

    if (fs.statSync(pathname).isDirectory()) {
      pathname += '/index.html';
    }

    fs.readFile(pathname, function(err, data){
      if(err){
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        const ext = path.parse(pathname).ext;
        res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
        res.end(data);
      }
    });
  });
}).listen(parseInt(port));
