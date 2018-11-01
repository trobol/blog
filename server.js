const express = require('express'),
app = express(),
http = require('http'),
fs = require('fs'),
spdy = require('spdy'),
posts = require('./posts.js'),
path = require('path'),
portHttp = 80,
portHttps = 443;


app.use(function(req, res, next) {
	if(!path.extname(req.path)) {
		res.sendFile('public/index.html' , { root : __dirname});
		console.log("BOOP");
	} else {
		console.log(req.path);
		next();
	}
});	
app.use(posts);
app.use(express.static('public'));

let httpApp = express();

httpApp.use('/.well-known/acme-challenge/', express.static('.well-known'));

httpApp.use(function(req, res) {
	res.writeHead(301, { "Location": "https://" + req.headers.host + req.url });
    res.end();
});

httpApp.listen(portHttp);

spdy
  .createServer({
	key: fs.readFileSync('server.key'),
	cert: fs.readFileSync('server.crt'),
	ca: fs.readFileSync('server.csr'),
	options: {
		plain: true,
		ssl: false,
		protocol:'http/1.1'
	}

  }, app)
  .listen(portHttps, (error) => {
    if (error) {
      console.error(error)
      return process.exit(1)
    } else {
      console.log('Listening on ports: ' + portHttps + ' and ' + portHttp + '.')
    }
  });
  