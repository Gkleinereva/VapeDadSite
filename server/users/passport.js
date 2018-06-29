var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');
var crypto = require('crypto');

passport.use(new LocalStrategy(
	
	//Sets passport's expected usernameField to the field we'll be using
	{
		usernameField: 'email'
	},

	function(username, password, done) {

		//Read our user file from the filesystem
		fs.readFile('./server/users/bin.js', 'utf8', function(err, data) {
			
			//Jump out if we had an error reading the file
			if(err) {
				console.log("File not found");
				return done('err'); 
			}

			//Otherwise parse our user into an object
			let user = JSON.parse(data);

			//Check that the username is correct
			if(username != user.email) {
				return done(null, false, {
					message: 'User not found'
				});
			}

			//Check that the password is correct
			let instanceHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
			if(instanceHash != user.hash) {
				return done(null, false, {
					message: 'Incorrect Password'
				});
			}

			//Otherwise, the login is legitament and we return the user
			return done(null, user);
		});
	}
));