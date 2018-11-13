const express = require('express'),
app = express(),
posts = require('./posts.js'),
push = require('./push.js')
path = require('path'),
fs = require('fs');


app.use(function(req, res, next) {
	if(!path.extname(req.path)) {
		let files = {
			files: [
				{
					location:'style.css',
					path:'style.css',
					type: 'text/plain'
				},
				{
					location:'main.js',
					path:'main.js',
					type: 'application/javascript'
				},
				{
					location:'img/spinner.svg',
					path:'img/spinner.svg',
					type: 'image/svg+xml'
				},
				{
					location:'fonts.css',
					path:'fonts.css',
					type: 'text/plain'
				},
				{
					location:'fonts/righteous-v6-latin-regular.woff2',
					path:'fonts/righteous-v6-latin-regular.woff2',
					type: 'font/woff2'
				}
			],
			root:`${__dirname}/public`
		};

		push(res, files);
	
	  
		res.writeHead(200);
		res.end(fs.readFileSync(`${__dirname}/public/index.html`));
		  
	} else {
		console.log(req.path);
		next();
	}
});	
app.use(posts);

app.use(express.static(`${__dirname}/public`));

module.exports = app;