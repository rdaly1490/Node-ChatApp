module.exports = function(passport, FacebookStrategy, config, mongoose) {

	var chatUser = new mongoose.Schema({
		profileID: String,
		fullName: String,
		profilePic: String
	});

	var userModel = mongoose.model('chatUser', chatUser);

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		userModel.findById(id, function(err, user) {
			done(err, user);
		});
	})

	passport.use(new FacebookStrategy({
		clientID: config.fb.appId,
		clientSecret: config.fb.appSecret,
		callbackURL: config.fb.callBackURL,
		profileFields: ['id', 'displayName', 'photos']
	}, function(accessToken, refreshToken, profile, done) {
		/* Check if user exists in MongoDB database
		   If user exists return profile
		   If not create one and return profile for app use
		*/
		userModel.findOne({'profileID' : profile.id}, function(err, result) {
			if (result) {
				done(null, result);
			} else {
				// Create a new user in our mongolab account
				var newChatUser = new userModel({
					profileID: profile.id,
					fullName: profile.displayName,
					profilePic: profile.photos[0].value || ''	
				});

				newChatUser.save(function(err) {
					done(null, newChatUser);
				});
			}
		});

	}));
}