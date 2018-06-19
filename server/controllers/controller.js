const fs = require('fs-extra');

exports.AddComic = function(req, res, next) {
	res.send("Success");
}

exports.UploadImage = function(req, res, next) {

	var fstream;
	console.log(req.busboy);
	// req.pipe(req.busboy);
	// req.busboy.on('file', function(fieldname, file, filename) {
	// 	console.log("Uploading: " + filename);

	// 	fstream = fs.createWriteStream(__dirname + '/img/' + filename);
	// 	file.pipe(fstream);

	// 	fstream.on('close', function() {
	// 		console.log("upload finished of " + filename);
	// 		res.end();
	// 	});
	// });

	res.end();
}