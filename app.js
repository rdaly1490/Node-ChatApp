var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ConnectMogo = require('connect-mongo')(session);
var FacebookStrategy = require('passport-facebook');
var passport = require('passport');
var http = require('http');
var io = require('socket.io');

var appRoutes = require('./routes/routes');
var passportAuth = require('./auth/passportAuth');
var socketConfig = require('./socket/socket');
var config = require('./config/config');

var app = express();
mongoose.connect(config.dbURL);

// list of rooms users create
var rooms = [];

app.engine('html', require('hogan-express'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// // Where to look for static files (css, images, etc.)
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/scripts'));

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

app.use(passport.initialize());
app.use(passport.session());

passportAuth(passport, FacebookStrategy, config, mongoose);
appRoutes(express, app, passport, config, rooms);

var port = process.env.PORT || 3000;

var server = http.createServer(app);

socketConfig(io.listen(server), rooms);

server.listen(port, function() {
	console.log('server running on port ' + port + ' in ' + env + ' mode');
})

// app.listen(port, function() {
// 	console.log('server running....');
// });


