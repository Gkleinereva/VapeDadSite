var fs = require('fs');

exports.AddComic = function(req, res, next) {

	let comicDir = "comic_data/" + req.body.comicNum;
	
	// Checks if comic directory exists already.  If it does, this should be a PUT and we throw an error
	// If it doesn't we'll go ahead and create it
	// NOTE: *Sync methods shouldn't be used for common operations since they hold up the Node Loop
	if(fs.existsSync(comicDir)) {
		const err = new Error("Comic Directory Already Exists!");
		return next(err);
	}
	else {
		fs.mkdirSync(comicDir);
	}

	// Empty object that we'll populate with the contents of our schema
	var schemaObject = {};
	schemaObject.releaseDate = req.body.releaseDate;
	schemaObject.images = [];

	//Save image files to disk
	var imageIndex = 0;
	while(imageIndex < req.body.images.length) {
		
		// First write the file to disk
		fs.writeFile(
			comicDir + "/" + req.body.imageData[imageIndex].filename, 
			req.body.imageData[imageIndex].value, 
			'base64', 
			function(err) {
				console.log(err);
			}
		);

		// Next write the fileNames and Locations to the schemaObject
		schemaObject.images.push({});
		schemaObject.images[imageIndex].filename = req.body.imageData[imageIndex].filename;
		schemaObject.images[imageIndex].locations = req.body.images[imageIndex].locations.split(',');

		imageIndex++;
	}

	// Finally, write our schemaObject to file
	fs.writeFile(
		comicDir + "/" + "schema.json",
		JSON.stringify(schemaObject),
		function(err) {
			console.log(err);
		}
	);

	// Redirect the user to the admin site
	res.redirect("/admin");
}
