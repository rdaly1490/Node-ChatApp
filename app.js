var express = require('express');
var path = require('path');

var app = express();

var port = process.env.PORT || 3000;

app.engine('html', require('hogan-express'));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

// // Where to look for static files (css, images, etc.)
app.use(express.static(__dirname + '/public'));

app.listen(port, function() {
	console.log('server running....');
});

app.get('/', function(req, res, next) {
	res.render('index', {title: 'ChatApp'});
});