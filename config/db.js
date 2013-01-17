var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', function (err) {
	console.error("\n**Database connection error**\n")
	console.error(err);
});

db.once('open', function () {
	// yay!
	console.log("Database connection open");
});

module.exports = mongoose;