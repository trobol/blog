const express = require('express'),
app = express(),
<<<<<<< HEAD
http = require('http'),
fs = require('fs'),
spdy = require('spdy'),
posts = require('./posts.js'),
path = require('path'),
portHttp = 80,
portHttps = 443;
=======
posts = require('./posts.js'),
push = require('./push.js')
path = require('path'),
fs = require('fs');
>>>>>>> d15e71c008ce47c7546b3de12bcca8b5f172f5de


app.use(function(req, res, next) {
	if(!path.extname(req.path)) {
<<<<<<< HEAD
		res.sendFile('public/index.html' , { root : __dirname});
		console.log("BOOP");
=======
		let files = {
			files: [
				{
					location:'/style.css',
					path:'style.css',
					type: 'text/css'
				},
				{
					location:'/main.js',
					path:'main.js',
					type: 'application/javascript'
				},
				{
					location:'/img/spinner.svg',
					path:'img/spinner.svg',
					type: 'image/svg+xml'
				},
				{
					location:'/fonts.css',
					path:'fonts.css',
					type: 'text/css'
				},
				{
					location:'/fonts/righteous-v6-latin-regular.woff2',
					path:'fonts/righteous-v6-latin-regular.woff2',
					type: 'font/woff2'
				},
				{
					location:'/img/background.gif',
					path:'img/background.gif',
					type: 'image/gif'
				},
				{
					location:'/favicon.ico',
					path:'favicon.ico',
					type: 'image/x-icon'
				},
				{
					location:'/manifest.json',
					path:'manifest.json',
					type: 'application/manifest+json'
				}

			],
			root:`${__dirname}/public`
		};
		push(res, files);
		res.writeHead(200);
		res.end(fs.readFileSync(`${__dirname}/public/index.html`));
		  
>>>>>>> d15e71c008ce47c7546b3de12bcca8b5f172f5de
	} else {
		console.log(req.path);
		next();
	}
});	
<<<<<<< HEAD
app.use(posts);
app.use(express.static('public'));
=======
app.use(posts.router);

app.use(express.static(`${__dirname}/public`));
>>>>>>> d15e71c008ce47c7546b3de12bcca8b5f172f5de

module.exports = app;