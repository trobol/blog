const express = require('express'),
app = express(),
posts = require('./posts.js'),
path = require('path');


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
app.use(express.static(`${__dirname}/public`));

module.exports = app;