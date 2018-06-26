// Required Module for filesystem operations
var fs = require('fs');

//We'll be using this to parse dates
var moment = require('moment');

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
	let date = new Date(req.body.releaseDate);
	schemaObject.releaseDate = Date.parse(req.body.releaseDate) + 1000*60*60*7;
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

		// Parse our data string into JSON
		data = JSON.parse(data);

		//String to hold our HTML output
		let html = '<div style="position:absolute;">';

		// The dimension we want the images to be
		let imgDims = 200;

		let imageIndex = 0;
		let locationIndex = 0;
		while(imageIndex < data.images.length) {
				
			// First add an opening <img> tag
			html += '<img style="';

			// Handle the case where we're only filling 1 block
			if(data.images[imageIndex].locations.length == 1) {
				html += 'width:' + imgDims + 'px;height:' + imgDims + 'px;';
				html += 'left:' + imgDims*((data.images[imageIndex].locations[0])%4) + 'px;';
				html += 'top:' + (imgDims*Math.floor(data.images[imageIndex].locations[0]/4) + 50) + 'px;';
			}

			// Handle the case where we have multiple blocks
			else {

				// Blocks are in a row
				if(parseInt(data.images[imageIndex].locations[0]) + 1 ==  parseInt(data.images[imageIndex].locations[1])) {
					html += 'width:' + imgDims*data.images[imageIndex].locations.length + 'px;height:' + imgDims + 'px;';
					html += 'left:' + imgDims*((data.images[imageIndex].locations[0])%4) + 'px;';
					html += 'top:' + (imgDims*Math.floor(data.images[imageIndex].locations[0]/4) + 50) + 'px;';
				}

				else {
					html += 'width:' + imgDims + 'px;height:' + imgDims*data.images[imageIndex].locations.length + 'px;';
					html += 'left:' + imgDims*((data.images[imageIndex].locations[0])%4) + 'px;';
					html += 'top:' + (imgDims*Math.floor(data.images[imageIndex].locations[0]/4) + 50) + 'px;';
				}
			}

			html += 'position:absolute"'
			html += ' src="/' + request.body.comicNum + '/' + data.images[imageIndex].filename + '">';

			imageIndex++;
		}

		//Add header giving release date at the bottom
		html += '</div><div><p style="font-style:italic; margin:auto; width:100%;">Comic #: ' + request.body.comicNum + '; ';
		html +=  'Release Date: ' + moment(data.releaseDate).format('MMMM Do, YYYY') + '; ';
		html += 'Permanent Link: <a href="' + request.protocol + '://' + request.get('host') + '/comic/' + request.body.comicNum + '">';
		html += request.protocol + '://' + request.get('host') + '/comic/' + request.body.comicNum + '</a></p></div>';
		console.log(moment(data.releaseDate).format('MMMM Do, YYYY HH:mm:ss'));

		// Finally, write our HTML to file
		fs.writeFile(
			"comic_data/" + request.body.comicNum + "/" + "comic.html",
			html,
			function(err) {
				console.log(err);
			}
		);
	});
}

exports.GetLatest = function(req, res, next) {

	console.log("Latest Got from API");

	// First, We'll read the comic_data directory to see what comic are available
	fs.readdir('comic_data', function(err, items) {

		let numAry = items.map(Number);
		numAry.sort(function(a, b) {return a - b});

		// Starting with the highest comic number, we'll comb through the directory and 
		// find the latest released comic
		let comicIndex = numAry.length - 1;
		let schema;
		while(true) {
			schema = JSON.parse(fs.readFileSync('comic_data/' + numAry[comicIndex] + '/schema.json', 'utf8'));

			// Make sure the comic we found is released
			if(schema.releaseDate < Date.now()) {

				// Once we've found the latest comic, we'll read the HTML snippet and send it to the client
				fs.readFile('comic_data/' + numAry[comicIndex].toString() + '/comic.html', 'utf8', (err, data) => {
					res.send(data);
					res.end();
				});
				return;
			}

			comicIndex--;
		}

	});
}

// Returns an array of all released comic numbers
exports.GetComicNumberList = function(req, res, next) {

	console.log("List Got from API");

	// First, We'll read the comic_data directory to see what comic are available
	fs.readdir('comic_data', function(err, items) {

		let numAry = items.map(Number);
		numAry.sort(function(a, b) {return a - b});

		// Starting with the highest comic number, we'll pop unreleased comics until we find a released one
		let comicIndex = numAry.length - 1;
		let schema;
		while(true) {
			schema = JSON.parse(fs.readFileSync('comic_data/' + numAry[comicIndex] + '/schema.json', 'utf8'));

			// If the comic we found is released, we'll return the remaining items in the array
			if(schema.releaseDate < Date.now()) {

				res.send(numAry);
				return;
			}

			numAry.pop();
			comicIndex--;
		}

	});
}

//End point to return the comic list to the admin page
exports.GetComicAdminData = function(req, res, next) {
	// First, We'll read the comic_data directory to see what comic are available
	fs.readdir('comic_data', function(err, items) {

		let responseJson = {};

		let numAry = items.map(Number);
		numAry.sort(function(a, b) {return b - a});

		//append comic numbers to response
		responseJson.comics = numAry;

		// Open the schema file of the most recently released comic
		fs.readFile('comic_data/' + numAry[0] + '/schema.json', (err, data) => {
			if(err) {
				let err = new Error('Schma not found');
				err.status = 404;
				return next(err)
			}

			schema = JSON.parse(data);
			responseJson.latestDate = moment(schema.releaseDate).format('MMMM Do, YYYY');

			res.send(JSON.stringify(responseJson));
			res.end();
		});
	});
}

// Gets a specific comic number and sends it to the client
exports.GetComic = function(req, res, next) {
	console.log("Get Comic" + req.params.comicNum);

	fs.readFile('comic_data/' + req.params.comicNum + '/schema.json', (err, data) => {
		
		// The comic number doesn't exist
		if(err) {
			var err = new Error('Comic Not Found');
			err.status = 404;
			return next(err);
		}

		schema = JSON.parse(data);
		
		// The comic we're looking for has been released
		if(schema.releaseDate < Date.now()) {
			fs.readFile('comic_data/' + req.params.comicNum + '/comic.html', 'utf8', (err, data) => {
				res.send(data);
				res.end();
			});
		}

		//The comic we're looking for hasn't been released
		else {
			var err = new Error('Comic Not Found');
			err.status = 404;
			return next(err);
		}
	});
}

// Can run from controllers/ with 'node controller.js CompileTest 1'
exports.CompileTest = function(comicNum) {
	console.log("here");

	fs.readFile("../../comic_data/" + comicNum + "/schema.json", 'utf8', (err, data) => {
		if(err) {
			return console.log(err)
		}


			// Parse our data string into JSON
			data = JSON.parse(data);

			//String to hold our HTML output
			let html = '<div style="position:absolute;">';

			// The dimension we want the images to be
			let imgDims = 200;

			let imageIndex = 0;
			let locationIndex = 0;
			while(imageIndex < data.images.length) {
				
				// First add an opening <img> tag
				html += '<img style="';

				// Handle the case where we're only filling 1 block
				if(data.images[imageIndex].locations.length == 1) {
					html += 'width:' + imgDims + 'px;height:' + imgDims + 'px;';
					html += 'left:' + imgDims*((data.images[imageIndex].locations[0])%4) + 'px;';
					html += 'top:' + (imgDims*Math.floor(data.images[imageIndex].locations[0]/4) + 30) + 'px;';
				}

				// Handle the case where we have multiple blocks
				else {

					// Blocks are in a row
					if(parseInt(data.images[imageIndex].locations[0]) + 1 ==  parseInt(data.images[imageIndex].locations[1])) {
						html += 'width:' + imgDims*data.images[imageIndex].locations.length + 'px;height:' + imgDims + 'px;';
						html += 'left:' + imgDims*((data.images[imageIndex].locations[0])%4) + 'px;';
						html += 'top:' + (imgDims*Math.floor(data.images[imageIndex].locations[0]/4) + 30) + 'px;';
					}

					else {
						html += 'width:' + imgDims + 'px;height:' + imgDims*data.images[imageIndex].locations.length + 'px;';
						html += 'left:' + imgDims*((data.images[imageIndex].locations[0])%4) + 'px;';
						html += 'top:' + (imgDims*Math.floor(data.images[imageIndex].locations[0]/4) + 30) + 'px;';
					}
				}

				html += 'position:absolute"'
				html += ' src="/' + comicNum + '/' + data.images[imageIndex].filename + '">';

				imageIndex++;
			}

			//Add header giving release date at the bottom
			html += '</div><div><p style="font-style:italic; margin:auto; width:100%;">Comic #: ' + comicNum + '; ';
			html +=  'Release Date: ' + moment(data.releaseDate).format('MMMM Do, YYYY');
			html += 'Permanent Link: <a href="' + request.protocol + '://' + request.get('host') + '/' + comicNum + '">';
			html += request.protocol + '://' + request.get('host') + '/' + comicNum + '</a></p></div>';
			console.log(moment(data.releaseDate).format('MMMM Do, YYYY HH:mm:ss'));

			// Finally, write our HTML to file
			fs.writeFile(
				"../../comic_data/" + comicNum + "/" + "comic.html",
				html,
				function(err) {
					console.log(err);

				}
				);
		});
}

//Module used for testing
var runnable = require('make-runnable');