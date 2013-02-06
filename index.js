var ff = require("ff");
var twitter = require("./config/twitter");

var Player = require("./models/Player");
var Event  = require("./models/Event");

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
	var command = tokens[1]; //first token will be @questinatweet
	var screenName = data.user.screen_name;

	ff(function () {
		Player.findOrCreate(screenName, this.slot());	
	}, function (player) {
		//if the command is roll
		if ((/roll/i).test(command)) {
			this.succeed(Event.roll(player));
		} else if ((/attack|fight|battle/i).test(command)) {
			//find or create the opponent
			this.pass(player);
			Player.findOrCreate(tokens[2], this.slot())
		} else {
			this.fail({error: "Invalid command"});
		}
	}, function (player, enemy) {
		this.succeed(Event.attack(player, enemy));
	}).success(function (tweet) {
		console.log("After the event:", tweet);
	}).error(function (err) {
		console.error(err);
	});
}

//export internal method for testing
exports.parse = parse;