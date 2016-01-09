var express = require('express');
// var path = require('path');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ConnectMogo = require('connect-mongo')(session);

var appRoutes = require('./routes/routes');
var config = require('./config/config');

var app = express();
mongoose.connect(config.dbURL);

app.engine('html', require('hogan-express'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// // Where to look for static files (css, images, etc.)
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());

var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
	app.use(session({secret: config.sessionSecret}));
} else {
	app.use(session({
		secret: config.sessionSecret,
		store: new ConnectMogo({
			// url: config.dbURL,
			mongoose_connection: mongoose.connections[0],
			stringify: true
		})
	}));
}

appRoutes(express, app);

var port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log('server running....');
});