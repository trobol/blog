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