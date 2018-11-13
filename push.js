fs = require('fs');
module.exports = (res, f) => {
	/*
	{
		location:
		path:
		type:
	}
	*/
	if (res.push){
		console.log("Push");
		for(let file of f.files) {
			let content = fs.readFileSync(`${f.root}/${file.path}`);
			res.push(file.location, {
				req: {'accept': '**/*'},
				res: {'content-type': file.type}
			})
			.on('error', err => {
				console.log(err);
			})
			.end(content);
			console.log(`Added ${f.root}/${file.path} at ${file.location}`);
		}
	}
};