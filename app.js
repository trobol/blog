const express = require('express'),
	app = express(),
	posts = require('./posts.js'),
	push = require('./push.js')
path = require('path'),
	fs = require('fs');

app.use(require('./profiler.js'));
app.use(function (req, res, next) {
	if (!path.extname(req.path)) {
		let files = {
			files: [
				{
					location: '/style.css',
					path: 'style.css',
					type: 'text/css'
				},
				{
					location: '/main.js',
					path: 'main.js',
					type: 'application/javascript'
				},
				{
					location: '/img/spinner.svg',
					path: 'img/spinner.svg',
					type: 'image/svg+xml'
				},
				{
					location: '/img/icons.svg',
					path: 'img/icons.svg',
					type: 'image/svg+xml'
				},
				{
					location: '/img/name.svg',
					path: 'img/name.svg',
					type: 'image/svg+xml'
				},
				{
					location: '/fonts.css',
					path: 'fonts.css',
					type: 'text/css'
				},
				{
					location: '/fonts/righteous-v6-latin-regular.woff2',
					path: 'fonts/righteous-v6-latin-regular.woff2',
					type: 'font/woff2'
				},
				{
					location: '/favicon.ico',
					path: 'favicon.ico',
					type: 'image/x-icon'
				},
				{
					location: '/manifest.json',
					path: 'manifest.json',
					type: 'application/manifest+json'
				}

			],
			root: `${__dirname}/public`
		};
		push(res, files);
		res.writeHead(200);
		res.end(fs.readFileSync(`${__dirname}/public/index.html`));

	} else {
		next();
	}
});
app.use(posts.router);

app.use(express.static(`${__dirname}/public`));

module.exports = app;