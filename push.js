fs = require('fs');
module.exports = (res, f) => {
	/*
	{
		location:
		path:
		type:
	}
	*/
	if (res.push) {
		for (let file of f.files) {
			let content = fs.readFileSync(`${f.root}/${file.path}`);
			let stream = res.push(file.location, {
				status: 200, // optional
				method: 'GET', // optional
				request: {
					accept: '*/*'
				},
				response: {
					'Content-Type': file.type
				}
			})
			stream.on('error', err => {
				console.log(err);
			})
			stream.end(content);
		}
	}
};