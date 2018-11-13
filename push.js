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
			let stream = res.push(file.location, {
				status: 200, // optional
				method: 'GET', // optional
				request: {
				  accept: '*/*'
				},
				response: {
					'content-type': file.type
				}
			})
			stream.on('error', err => {
				console.log(err);
			})
			stream.end(content);
			console.log(`Added ${f.root}/${file.path} at ${file.location}`);
		}
	}
};