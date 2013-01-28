var ff = require("ff");
var twitter = require("./config/twitter");

var Player = require("./models/Player");

/**
* 1. Receive mention
* 2. Parse content
*	a. roll: get random event
* 3.
*/

//stream mentions
twitter.stream("statuses/filter", {track: "@questinatweet"}, function(stream) {
	stream.on("data", function (data) {
		console.log(data);
		parse(data);
	});
});

function parse (data) {
	if (!data.text || !data.user)
		return console.error("Invalid data object");

	var tokens = data.text.split(" ");
	var command = data[1]; //first token will be @questinatweet
	var screenName = data.user.screen_name;

	//find player with that screen name
	var player = Player.find({handle: screenName}, function () {
		
	});
}

