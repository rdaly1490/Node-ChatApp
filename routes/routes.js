module.exports = function(express, app) {
	var router = express.Router();

	router.get('/', function(req, res, next) {
		res.render('index', {title: 'ChatApp'});
	});

	router.get('/chatrooms', function(req, res, next) {
		res.render('chatrooms', {title: 'Chatrooms'})
	});

	router.get('/setcolor', function(req, res, next) {
		req.session.favColor = 'Green';
		res.send('Setting favorite color');
	});

	router.get('/getcolor', function(req, res, next) {
		res.send('Fav Color: ' + (req.session.favColor === undefined ? 'Not Found' : req.session.favColor));
	})

	app.use('/', router);
}