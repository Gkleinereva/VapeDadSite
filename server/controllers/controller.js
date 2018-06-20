// Required Module for filesystem operations
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

			// Write HTML snippet as soon as schema file exists
			CompileHtml(req);
		}
		);

	// End the response; handle redirect on Angular side
	res.end();
}

// Helper function to compile the html snippet that will be sent to Angular to display the comic
function CompileHtml(request) {
	let schema = {};
	
	// Read in the schema file that we just created
	fs.readFile("comic_data/" + request.body.comicNum + "/schema.json", 'utf8', (err, data) => {
		if(err) return console.log(err);

		console.log(data);
	});
}

exports.compileTest = function(comicNum) {
	console.log("here");

	fs.readFile("../../comic_data/" + comicNum + "/schema.json", 'utf8', (err, data) => {
		if(err) {
			return console.log(err)
		}

		console.log(data);

			// Parse our data string into JSON
			data = JSON.parse(data);

			//String to hold our HTML output
			let html = '';

			// The dimension we want the images to be
			let imgDims = 300;

			let imageIndex = 0;
			let locationIndex = 0;
			while(imageIndex < data.images.length) {
				
				// First add an opening <img> tag
				html += '<img style="';

				// Handle the case where we're only filling 1 block
				if(data.images[imageIndex].locations.length == 1) {
					html += 'width:' + imgDims + 'px;height:' + imgDims + 'px;';
					html += 'left:' + imgDims*((data.images[imageIndex].locations[0])%4) + 'px;';
					html += 'top:' + imgDims*Math.floor(data.images[imageIndex].locations[0]/4) + 'px;"';
				}

				// Handle the case where we have multiple blocks
				else {

					// Blocks are in a row
					if(parseInt(data.images[imageIndex].locations[0]) + 1 ==  parseInt(data.images[imageIndex].locations[1])) {
						html += 'width:' + imgDims*data.images[imageIndex].locations.length + 'px;height:' + imgDims + 'px;';
						html += 'left:' + imgDims*((data.images[imageIndex].locations[0])%4) + 'px;';
						html += 'top:' + imgDims*Math.floor(data.images[imageIndex].locations[0]/4) + 'px;"';
					}

					else {
						html += 'width:' + imgDims + 'px;height:' + imgDims*data.images[imageIndex].locations.length + 'px;';
						html += 'left:' + imgDims*((data.images[imageIndex].locations[0])%4) + 'px;';
						html += 'top:' + imgDims*Math.floor(data.images[imageIndex].locations[0]/4) + 'px;"';
					}
				}

				html += ' src="/' + comicNum + '/' + data.images[imageIndex].filename + '">';

				imageIndex++;
			}

			// Finally, write our schemaObject to file
			fs.writeFile(
				"../../comic_data/" + comicNum + "/" + "comic.html",
				html,
				function(err) {
					console.log(err);

				}
				);

			console.log(html);

	});
}

//Module used for testing
var runnable = require('make-runnable');