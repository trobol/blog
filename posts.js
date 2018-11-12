
const fs = require('fs'),
express = require('express'),
router = express.Router(),
path = `${__dirname}/public/posts/`;

router.get('/posts.json', function(req, res) {
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(posts));
});

let posts = [];


getAllPosts().then(console.log("Retrieved Posts"));
fs.watch(path, (eventType, filename) => {
	if(eventType == 'rename') {
		if(fs.existsSync(path + filename)) {
			getAllPosts().then(console.log(`Added post: ${filename}`, posts));
		} else {
			posts = posts.filter(p => p.url !== filename);
			console.log(`Removed post: ${filename}`, posts);
		}
	}
});

function getAllPosts() {
	console.log("Getting posts");
	return new Promise((resolve, reject) => {
		let items = fs.readdirSync(path),
		date = new Date();
		posts = [];
		
		for (var i=0; i<items.length; i++) {
			let filePath = `${path}${items[i]}/post.json`;
			
			if(fs.existsSync(filePath)) {
				let post = JSON.parse(fs.readFileSync(filePath, 'utf8'));
				if(post.url != items[i]) {
					post.url = items[i];
					fs.writeFileSync(filePath, JSON.stringify(post, null, 2));
				}
				posts.push(post);
			} else {
				let template = {
					title:"Default title",
					description:"Default description",
					day:date.getDate(),
					month:date.getMonth(),
					year: date.getFullYear(),
					url: items[i]
				};
				
				fs.writeFileSync(filePath, JSON.stringify(template, null, 2));
			}
		}
		
		posts.sort(function(a, b) {
			if (a.year != b.year) {
				return b.year - a.year;
			} else if (a.month != b.month) {
				return b.month - a.month;
			} else if (a.day != b.day) {
				return b.day - a.day;
			}
		});
		
		for(let n in posts) {
			let post = posts[n],
			id = posts.length - n;
			if(post.id === undefined) {
				post.id === undefined;
				fs.writeFileSync(`${path}${post.url}/post.json`,JSON.stringify(post, null, 2));
			}
		}
		resolve(posts);
	});
}
module.exports = router;

