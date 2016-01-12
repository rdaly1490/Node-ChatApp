module.exports = function(express, app, passport, config, rooms) {
	var router = express.Router();

	router.get('/', function(req, res, next) {
		res.render('index', {title: 'ChatApp'});
	});

	// limit access to inner pages based on active session
	function securePages(req, res, next) {
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect('/');
		}
	}

	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/chatrooms',
		failureRedirect: '/'
	}));

	// securePages middleware ensures return to login if no session data(i.e. if page refreshed)
	router.get('/chatrooms', securePages, function(req, res, next) {
		res.render('chatrooms', {title: 'Chatrooms', user: req.user, config: config})
	});

	router.get('/room/:id', securePages, function(req, res, next) {
		var room_name = findRoomTitle(req.params.id);
		// .params means extracting this value from the url
		res.render('room', {user: req.user, room_number: req.params.id, room_name: room_name, config: config})
	});

	function findRoomTitle(roomId) {
		var n = 0;
		while(n < rooms.length) {
			if(rooms[n].room_number === roomId) {
				return rooms[n].room_name;
				break;
			} else {
				n++;
				continue;
			}
		}
	}

	router.get('/logout', function(req, res, next) {
		req.logout();
		res.redirect('/');
	});

	app.use('/', router);
}