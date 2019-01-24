
module.exports = (req, res, next) => {
	let start = Date.now();
	res.once('finish', () => {
		log(` [${Date.now() - start}ms]: ${req.path}`);
	});

	next();
};

const fs = require('fs'),
	logStream = fs.createWriteStream('info.log');
function log(msg) {
	var message = new Date().toISOString() + msg + "\n";
	logStream.write(message);
}