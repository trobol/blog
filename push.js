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
			res.push(file.location, {
				req: {'accept': '**/*'},
				res: {'content-type': file.type}
			})
			.on('error', err => {
				console.log(err);
			})
			.end(fs.readFileSync(`${f.root}/${file.path}`));
			console.log(`Added ${f.root}/${file.path} at ${file.location}`);
		}
	}
};