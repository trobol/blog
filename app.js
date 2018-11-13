const express = require('express'),
app = express(),
posts = require('./posts.js'),
path = require('path');


app.use(function(req, res, next) {
	if(!path.extname(req.path)) {
		Promise.all([
			fs.readFile('public/index.html'),
			fs.readFile('public/style.css'),
			fs.readFile('public/main.js'),
			fs.readFile('/public/img/spinner.svg'),
			fs.readFile('public/fonts.css'),
			fs.readFile('public/fonts/righteous-v6-latin-regular.woff2')
		  ]).then(files => {
	  
			// Does the browser support push?
			if (res.push){
				console.log("push");
				res.push('/style.css', {
					req: {'accept': '**/*'},
					res: {'content-type': 'text/css'}
				})
				.on('error', err => {
				  console.log(err);
				})
				.end(files[1]);
	  
				res.push('/main.js', {
					req: {'accept': '**/*'},
					res: {'content-type': 'application/javascript'}
				})
				.on('error', err => {
				  console.log(err);
				})
				.end(files[2]);
	
				res.push('/img/spinner.svg', {
					req: {'accept': '**/*'},
					res: {'content-type': 'image/svg+xml'}
				})
				.on('error', err => {
				  console.log(err);
				})
				.end(files[3]);
	
				res.push('/fonts.css', {
					req: {'accept': '**/*'},
					res: {'content-type': 'text/css'}
				})
				.on('error', err => {
				  console.log(err);
				})
				.end(files[4]);
	
				res.push('/fonts/righteous-v6-latin-regular.woff2', {
					req: {'accept': '**/*'},
					res: {'content-type': 'font/woff2'}
				})
				.on('error', err => {
				  console.log(err);
				})
				.end(files[5]);
	
			}
	  
			res.writeHead(200);
			res.end(files[0]);
		  }).catch(error => res.status(500).send(error.toString()));
	} else {
		console.log(req.path);
		next();
	}
});	
app.use(posts);

app.use(express.static(`${__dirname}/public`));

module.exports = app;