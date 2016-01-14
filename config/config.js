if (process.env.NODE_ENV === 'production') {
	module.exports = {
		dbURL : process.env.dbURL,
		sessionSecret: process.env.SESSION_SECRET,
		fb : {
			appId : process.env.FB_APPID,
			appSecret : process.env.FB_SECRET,
			callBackURL : process.env.FB_CALLBACK
		},
		host: process.env.HOST
	}
} else {
	module.exports = require('./developmentConfig.json');
}