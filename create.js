'use strict';
const mongoose = require('mongoose'),
express = require('express'),
router = express.Router(),
url = "mongodb://post:hello1@ds131973.mlab.com:31973/blog",
Schema = mongoose.Schema,
db = mongoose.connection,
PostSchema = {
	date: { type: String, required: true },
	description: { type: String, required: true },
	title: { type: String, required: true },
	url:{ type: String, required: true }
},
PostModel = mongoose.model('PostModel', PostSchema );

mongoose.connect(url);
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.post()
let post = new PostModel({

});

const scheme = {
	date: '01.01.2018',
	description: '',
	title: '',
	url:''
}